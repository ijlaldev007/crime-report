import mongoose from 'mongoose'; // Import mongoose

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env');
}

const MONGODB_URI = process.env.MONGODB_URI;

// Define a type for our mongoose cache
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Define a type for the global object with our mongoose property
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Initialize the cached connection
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Store in global to prevent reconnection on hot reload
if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 60000, // Increased timeout
      family: 4, // Use IPv4
      retryWrites: true,
      retryReads: true
    };

    mongoose.set('strictQuery', true);

    console.log('Attempting to connect to MongoDB...');

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB successfully');
        if (mongoose.connection.db) {
          console.log('Database name:', mongoose.connection.db.databaseName);
        }
        console.log('Connection state:', mongoose.connection.readyState);
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        if (error.name === 'MongooseServerSelectionError') {
          console.error('This could be an IP whitelist issue or network connectivity problem.');
        }
        if (error.message.includes('querySrv ECONNREFUSED')) {
          console.error('DNS resolution failed. This could be a network connectivity issue or firewall problem.');
        }
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
