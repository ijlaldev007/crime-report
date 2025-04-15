# Public Safety Reporting Platform

## General Constraints
- **Data Privacy**: Comply with GDPR/CCPA regulations
- **Security**: Prevent unauthorized access/data breaches
- **Performance**: <2s load times across devices

## General Needs
- Intuitive UI with clear navigation
- Robust error handling with user-friendly messages
- Comprehensive logging system

---

## EPIC 1: Authentication ✅

### Task 1.1: User Registration ✅  
**User Story**: As a new user, I want to register with email/password  

#### Subtask 1.1.1: Registration Form
- **User Story**: Form with name/email/password fields  
- **Constraints**:  
  - Email validation using HTML5 type  
  - Password complexity requirements  
- **Needs**:  
  - Real-time validation feedback  
  - Password strength meter  
- **Error Boundaries**:  
  - "Invalid email format" warning  
  - "Password must be 8+ characters" alert  

#### Subtask 1.1.2: MongoDB Storage
- **User Story**: Store user data securely  
- **Constraints**:  
  - bcrypt password hashing  
  - Unique email constraint  
- **Needs**:  
  - Pre-registration email check  
  - Email verification workflow  
- **Error Boundaries**:  
  - Handle duplicate email errors  
  - Database connection failures  

#### Subtask 1.1.3: NextAuth Integration
- **User Story**: Secure authentication flow  
- **Constraints**:  
  - NextAuth.js v4+  
  - HTTP-only cookies for sessions  
- **Needs**:  
  - Credentials provider setup  
  - Session callback configuration  
- **Error Boundaries**:  
  - Handle OAuth provider errors  
  - Session creation failures  

---

### Task 1.2: User Login ✅  
**User Story**: As a user, I want to log in securely  

#### Subtask 1.2.1: Login Form
- **User Story**: Simple email/password form  
- **Constraints**:  
  - Input validation  
  - Rate limiting  
- **Needs**:  
  - "Forgot Password" flow  
  - Social login options  
- **Error Boundaries**:  
  - "Invalid credentials" message  
  - Account lockout notifications  

#### Subtask 1.2.2: NextAuth Session
- **User Story**: Persistent session management  
- **Constraints**:  
  - JWT encryption for sessions  
  - Secure cookie settings  
- **Needs**:  
  - Role-based session claims  
  - Session refresh mechanism  
- **Error Boundaries**:  
  - Handle expired sessions  
  - Authorization middleware failures  

---

## EPIC 2: User Roles & Access Control ✅

### Task 2.1: Role Differentiation ✅  
**User Story**: Differentiate user/admin access  

#### Subtask 2.1.1: Role Property
- **User Story**: Store roles in MongoDB  
- **Constraints**:  
  - Enum: ['user', 'admin']  
  - Default role: 'user'  
- **Needs**:  
  - Admin approval workflow  
  - Role change audit logging  
- **Error Boundaries**:  
  - Invalid role assignments  
  - Database update failures  

#### Subtask 2.1.2: Role-Based Access
- **User Story**: Control UI/API access  
- **Constraints**:  
  - NextAuth middleware protection  
  - getServerSession() checks  
- **Needs**:  
  - Dynamic navigation rendering  
  - Admin dashboard isolation  
- **Error Boundaries**:  
  - Unauthorized access alerts  
  - Missing role errors  

---

## EPIC 3: Report Filing Module ✅

### Task 3.1: File Complaint ✅  
**User Story**: Submit complaints with details  

#### Subtask 3.1.1: Complaint Form
- **User Story**: Form with description/city  
- **Constraints**:  
  - 500-character limit  
  - City dropdown validation  
- **Needs**:  
  - Draft autosave  
  - Location autocomplete  
- **Error Boundaries**:  
  - Form validation errors  
  - Geolocation API failures  

#### Subtask 3.1.2: MongoDB Storage
- **User Story**: Store complaint data  
- **Constraints**:  
  - Reference user ID from session  
  - Status tracking  
- **Needs**:  
  - Full-text search index  
  - Version history  
- **Error Boundaries**:  
  - Database write errors  
  - Data validation failures  

---

## EPIC 4: Reports Viewer ✅

### Task 4.1: City Filtering ✅  
**User Story**: Filter reports by location  

#### Subtask 4.1.1: City Selector
- **User Story**: Dynamic city dropdown  
- **Constraints**:  
  - Predefined 10 cities  
  - URL-encoded params  
- **Needs**:  
  - Multi-select capability  
  - Search-as-type  
- **Error Boundaries**:  
  - Empty city handling  
  - Geolocation denials  

---

## EPIC 5: Admin Module ✅

### Task 5.1: Admin Access ✅  
**User Story**: Restricted admin features  

#### Subtask 5.1.1: NextAuth Role Checks
- **User Story**: Secure admin routes  
- **Constraints**:  
  - Server-side props verification  
  - Middleware validation  
- **Needs**:  
  - Action audit logging  
  - 2FA enforcement  
- **Error Boundaries**:  
  - Privilege escalation attempts  
  - Feature load failures  

---

## EPIC 6: UI/UX & Responsiveness ✅

### Task 6.1: Mobile Design ✅  
**User Story**: Mobile-first experience  

#### Subtask 6.1.1: Responsive Components
- **User Story**: Adaptive layouts  
- **Constraints**:  
  - CSS-in-JS breakpoints  
  - Dynamic imports  
- **Needs**:  
  - Touch optimization  
  - Motion reduction  
- **Error Boundaries**:  
  - Layout shift monitoring  
  - Mobile error states  

---

## EPIC 7: Data Structure ✅

### Task 7.1: MongoDB Design ✅  
**Collections**:  
```javascript
// users
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  role: String (enum),
  emailVerified: Date,
  createdAt: Date
}

// sessions (NextAuth)
{
  sessionToken: String,
  userId: ObjectId,
  expires: Date
}

// reports 
{
  type: String (enum),
  status: String,
  location: GeoJSON,
  createdAt: Date,
  updatedAt: Date
}