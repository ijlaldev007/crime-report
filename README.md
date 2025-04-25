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

## EPIC 1: Authentication 

### Task 1.1: User Registration ✅
**User Story**: As a new user, I want to register with my name, email, and password so that I can create an account and access the platform's features

#### Subtask 1.1.1: Registration Form ✅
- **User Story**: As a new user, I want a clear registration form with fields for my name, email, and password so that I can provide my information accurately and securely
- **Constraints**:
  - Email validation using HTML5 type
  - Password complexity requirements
- **Needs**:
  - Real-time validation feedback
  - Password strength meter
- **Error Boundaries**:
  - "Invalid email format" warning
  - "Password must be 8+ characters" alert

#### Subtask 1.1.2: MongoDB Storage ✅
- **User Story**: As a new user, I want my account information to be stored securely in the database so that my personal data remains protected and can be retrieved for future logins
- **Constraints**:
  - bcrypt password hashing
  - Unique email constraint
- **Needs**:
  - Pre-registration email check
  - Email verification workflow
- **Error Boundaries**:
  - Handle duplicate email errors
  - Database connection failures

#### Subtask 1.1.3: NextAuth Integration ✅
- **User Story**: As a registered user, I want my session to be managed securely with NextAuth so that I can maintain a persistent and secure connection to the platform
- **Constraints**:
  - NextAuth.js v4+
  - HTTP-only cookies for sessions
- **Needs**:
  - Credentials provider setup
  - Session callback configuration
- **Error Boundaries**:
  - Handle authentication failures
  - Session creation/validation errors
  - Token expiration handling

---

### Task 1.2: User Login ✅
**User Story**: As a registered user, I want to log in with my email and password so that I can access my account and use the platform's features

#### Subtask 1.2.1: Login Form ✅
- **User Story**: As a registered user, I want a simple login form with email and password fields so that I can easily access my account
- **Constraints**:
  - Input validation
  - Rate limiting
- **Needs**:
  - "Forgot Password" flow
  - Social login options
- **Error Boundaries**:
  - "Invalid credentials" message
  - Account lockout notifications

#### Subtask 1.2.2: NextAuth Session ✅
- **User Story**: As a registered user, I want NextAuth to manage my persistent session so that I can stay logged in securely
- **Constraints**:
  - NextAuth session management
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
**User Story**: As a platform administrator, I want to differentiate between regular users and admins so that I can control access to administrative features

#### Subtask 2.1.1: Role Property ✅
- **User Story**: As a platform administrator, I want user roles to be stored in the database so that I can assign and manage different permission levels
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
- **User Story**: As a platform administrator, I want to restrict access to admin routes based on user roles so that only authorized personnel can access sensitive features
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

## EPIC 3: Report Filing Module 

### Task 3.1: File Complaint 
**User Story**: As a registered user, I want to submit complaints about issues in my community so that authorities can investigate and address them

#### Subtask 3.1.1: Complaint Form
- **User Story**: As a registered user, I want a form with fields for description and city so that I can provide detailed information about my complaint
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
- **User Story**: As a registered user, I want my complaint to be saved with a timestamp and linked to my account so that I can track its status and authorities can contact me if needed
- **Constraints**:
  - Reference user ID from session
  - Status tracking
- **Needs**:
  - Full-text search index
  - Version history
- **Error Boundaries**:
  - Database write errors
  - Data validation failures

### Task 3.2: File Crime Report 
**User Story**: As a registered user, I want to submit crime reports with images so that I can provide evidence and help authorities investigate incidents

#### Subtask 3.2.1: Crime Form
- **User Story**: As a registered user, I want a form with fields for crime type, description, and image upload so that I can provide comprehensive information about the incident
- **Constraints**:
  - Max image size (e.g., 5MB)
  - Required fields validation
- **Needs**:
  - Image preview
  - User-friendly interface
- **Error Boundaries**:
  - Show invalid file errors
  - Form validation feedback

#### Subtask 3.2.2: Cloud Image Storage
- **User Story**: As a registered user, I want my uploaded images to be stored securely in the cloud so that they are preserved as evidence and can be accessed by authorities
- **Constraints**:
  - Secure storage with unique URLs
  - File type restrictions
- **Needs**:
  - Compliance with privacy laws
  - Efficient image storage
- **Error Boundaries**:
  - Handle upload failures
  - Storage error handling

#### Subtask 3.2.3: MongoDB Metadata
- **User Story**: As a registered user, I want my crime report details and image URLs to be saved in the database so that all information is linked and retrievable
- **Constraints**:
  - Validate image URLs
  - Data integrity checks
- **Needs**:
  - Link to user ID
  - Comprehensive metadata
- **Error Boundaries**:
  - Handle DB update errors
  - Data validation failures

### Task 3.3: File Missing Report 
**User Story**: As a registered user, I want to submit missing person reports with photos so that I can help locate missing individuals and alert the community

#### Subtask 3.3.1: Missing Person Form
- **User Story**: As a registered user, I want a form with fields for name, age, last seen location, and photo upload so that I can provide comprehensive information about the missing person
- **Constraints**:
  - Secure handling of personal data
  - Required fields validation
- **Needs**:
  - Clear field instructions
  - Sensitive data handling
- **Error Boundaries**:
  - Show missing/invalid field errors
  - Form validation feedback

#### Subtask 3.3.2: Photo Upload
- **User Story**: As a registered user, I want to upload photos of missing persons to secure cloud storage so that authorities and the public can identify them
- **Constraints**:
  - Generate unique photo URLs
  - File size/type restrictions
- **Needs**:
  - Compliance with privacy regulations
  - Efficient image handling
- **Error Boundaries**:
  - Handle upload failures
  - Storage error handling

#### Subtask 3.3.3: MongoDB Storage
- **User Story**: As a registered user, I want missing person details and photo URLs to be saved in the database so that all information is linked and retrievable
- **Constraints**:
  - Link to user ID
  - Data validation
- **Needs**:
  - Include status (default: "Pending")
  - Comprehensive data storage
- **Error Boundaries**:
  - Handle DB validation errors
  - Storage failure handling

---

## EPIC 4: Reports Viewer 

### Task 4.1: Filter by City 
**User Story**: As a platform user, I want to filter reports by city so that I can focus on incidents in my area of interest

#### Subtask 4.1.1: City Dropdown
- **User Story**: As a platform user, I want a dropdown menu pre-populated with cities so that I can easily select my location of interest
- **Constraints**:
  - Dynamic update if cities change
  - User-friendly selection
- **Needs**:
  - Clear dropdown label
  - Intuitive interface
- **Error Boundaries**:
  - Handle empty city list
  - Selection validation

#### Subtask 4.1.2: MongoDB Filtering
- **User Story**: As a platform user, I want the system to query the database for reports matching my selected city so that I only see relevant information
- **Constraints**:
  - Optimize query performance
  - Efficient data retrieval
- **Needs**:
  - Apply filter to all report types
  - Fast query response
- **Error Boundaries**:
  - Handle DB query errors
  - Empty results handling

### Task 4.2: Show Report Lists 
**User Story**: As a platform user, I want to view organized lists of crime reports, missing person reports, and personal complaints so that I can easily find the information I need

#### Subtask 4.2.1: Crime Reports
- **User Story**: As a platform user, I want to see a list of crime reports with type, description, and location so that I can understand the nature and location of incidents
- **Constraints**:
  - Readable format
  - Efficient data display
- **Needs**:
  - Clear information presentation
  - User-friendly interface
- **Error Boundaries**:
  - Handle "no reports" cases
  - Display error handling

#### Subtask 4.2.2: Missing Reports
- **User Story**: As a platform user, I want to see a list of missing person reports with name, age, last seen location, and photo so that I can help identify and locate missing individuals
- **Constraints**:
  - Privacy-sensitive display
  - Appropriate information sharing
- **Needs**:
  - Clear information presentation
  - Sensitive data handling
- **Error Boundaries**:
  - Handle "no reports" cases
  - Display error handling

#### Subtask 4.2.3: User Complaints
- **User Story**: As a logged-in user, I want to see a list of my submitted complaints with their status and timestamp so that I can track their progress
- **Constraints**:
  - Filter by user ID
  - Secure data access
- **Needs**:
  - Show status and timestamp
  - User-specific filtering
- **Error Boundaries**:
  - Handle "no complaints" cases
  - Display error handling

---

## EPIC 5: Admin Module 

### Task 5.1: Admin Access 
**User Story**: As an administrator, I want secure access to administrative features so that I can manage the platform effectively

#### Subtask 5.1.1: NextAuth Role Checks
- **User Story**: As an administrator, I want NextAuth to verify my admin role so that I can access administrative features securely
- **Constraints**:
  - Server-side props verification
  - Middleware validation
- **Needs**:
  - Action audit logging
  - 2FA enforcement
- **Error Boundaries**:
  - Privilege escalation attempts
  - Feature load failures

#### Subtask 5.1.2: Admin UI Features
- **User Story**: As an administrator, I want a distinct UI with admin tools so that I can easily identify and use administrative functions
- **Constraints**:
  - Hide from non-admins
  - Secure feature access
- **Needs**:
  - Clear visual differentiation
  - Admin-specific interface
- **Error Boundaries**:
  - Handle UI load failures
  - Feature access errors

### Task 5.2: Status Update 
**User Story**: As an administrator, I want to update the status of reports so that users can track the progress of their submissions

#### Subtask 5.2.1: Status Field
- **User Story**: As an administrator, I want to set report statuses (Pending/In Review/Closed) so that I can indicate the current state of investigation or resolution
- **Constraints**:
  - Consistent naming
  - Status validation
- **Needs**:
  - Apply to all report types
  - Status management system
- **Error Boundaries**:
  - Handle schema update errors
  - Status validation failures

#### Subtask 5.2.2: Status UI
- **User Story**: As an administrator, I want an intuitive interface for changing report statuses so that I can efficiently manage multiple reports
- **Constraints**:
  - Intuitive interface
  - User-friendly controls
- **Needs**:
  - Allow admin notes/comments
  - Efficient status management
- **Error Boundaries**:
  - Handle UI errors
  - Interface failure handling

#### Subtask 5.2.3: MongoDB Updates
- **User Story**: As an administrator, I want status changes to be saved with timestamps and my admin ID so that there is an audit trail of administrative actions
- **Constraints**:
  - Atomic updates
  - Data integrity
- **Needs**:
  - Log admin ID and timestamp
  - Audit trail for changes
- **Error Boundaries**:
  - Handle DB update errors
  - Update failure handling

---

## EPIC 6: UI/UX & Responsiveness 

### Task 6.1: Mobile-First Design 
**User Story**: As a mobile user, I want the platform to be optimized for my device so that I can access all features comfortably on a small screen

#### Subtask 6.1.1: Responsive Layout
- **User Story**: As a mobile user, I want the layout to adapt to my screen size using CSS Grid/Flexbox so that all content is accessible and readable
- **Constraints**:
  - Mobile-first approach
  - Cross-browser compatibility
- **Needs**:
  - Consistent element sizing
  - Adaptive layouts
- **Error Boundaries**:
  - Handle CSS errors
  - Layout rendering issues

#### Subtask 6.1.2: Cross-Device Testing
- **User Story**: As a platform user, I want the application to be tested across various devices so that I have a consistent experience regardless of my device
- **Constraints**:
  - Use Chrome DevTools simulations
  - Comprehensive testing
- **Needs**:
  - Optimize images for mobile
  - Performance optimization
- **Error Boundaries**:
  - Log UI/performance issues
  - Device compatibility problems

### Task 6.2: Navigation & Routing 
**User Story**: As a platform user, I want intuitive navigation so that I can easily find and access different sections of the application

#### Subtask 6.2.1: Next.js Router
- **User Story**: As a platform user, I want efficient routing between pages so that I can navigate the application quickly and without errors
- **Constraints**:
  - Handle all valid routes
  - Efficient navigation
- **Needs**:
  - Error page for invalid routes
  - Clear navigation paths
- **Error Boundaries**:
  - Log routing errors
  - Navigation failure handling

#### Subtask 6.2.2: Mobile Menu
- **User Story**: As a mobile user, I want a sidebar menu that works well on small screens so that I can navigate the application easily on my mobile device
- **Constraints**:
  - Accessible on small screens
  - User-friendly design
- **Needs**:
  - Include all navigation links
  - Intuitive mobile interface
- **Error Boundaries**:
  - Handle menu display errors
  - Interface rendering issues

---

## EPIC 7: Data Structure 

### Task 7.1: MongoDB Collections 
**User Story**: As a platform developer, I want efficient data storage structures so that the application can retrieve and store information quickly and reliably

#### Subtask 7.1.1: users Collection
**Schema**:
```javascript
{
  _id: ObjectId,
  uid: String (unique),
  name: String,
  email: String (unique),
  role: String (enum: ['user', 'admin']),
  createdAt: Date
}
```
- **Constraints**: Unique uid and email
- **Needs**: Indexes on uid and email
- **Error Boundaries**: Handle schema validation errors

#### Subtask 7.1.2: complaints Collection
**Schema**:
```javascript
{
  _id: ObjectId,
  uid: String (ref: users.uid),
  city: String,
  description: String,
  status: String (enum: ['Pending', 'In Review', 'Closed']),
  createdAt: Date,
  updatedAt: Date
}
```
- **Constraints**: Reference users.uid
- **Needs**: Indexes on city and status
- **Error Boundaries**: Handle schema validation errors

#### Subtask 7.1.3: crimes Collection
**Schema**:
```javascript
{
  _id: ObjectId,
  uid: String (ref: users.uid),
  city: String,
  crimeType: String,
  description: String,
  imageURL: String,
  status: String (enum: ['Pending', 'In Review', 'Closed']),
  createdAt: Date,
  updatedAt: Date
}
```
- **Constraints**: Validate imageURL format
- **Needs**: Indexes on city and status
- **Error Boundaries**: Handle URL validation errors

#### Subtask 7.1.4: missing Collection
**Schema**:
```javascript
{
  _id: ObjectId,
  uid: String (ref: users.uid),
  name: String,
  age: Number,
  lastSeen: String,
  city: String,
  imageURL: String,
  status: String (enum: ['Pending', 'In Review', 'Closed']),
  createdAt: Date,
  updatedAt: Date
}
```
- **Constraints**: Secure personal data handling
- **Needs**: Indexes on city and status
- **Error Boundaries**: Handle data sanitization errors

---

## EPIC 8: Quality & Testing 

### Task 8.1: Functional Testing 
**User Story**: As a platform developer, I want comprehensive functional testing so that I can ensure all features work as expected

#### Subtask 8.1.1: Auth Workflows
- **User Story**: As a platform developer, I want to test registration and login workflows with valid and invalid inputs so that I can ensure the authentication system is secure and reliable
- **Test**: Registration/login with valid/invalid inputs
- **Needs**: Clear test cases
- **Error Boundaries**: Log failures

#### Subtask 8.1.2: Report Submissions
- **User Story**: As a platform developer, I want to test report submission workflows with valid and invalid data so that I can ensure the reporting system works correctly
- **Test**: Submit all report types with valid/invalid data
- **Needs**: Verify DB storage accuracy
- **Error Boundaries**: Log data inconsistencies

#### Subtask 8.1.3: Admin Features
- **User Story**: As a platform developer, I want to test admin features with different user roles so that I can ensure role-based access control is functioning properly
- **Test**: Status updates with different roles
- **Needs**: Verify permission enforcement
- **Error Boundaries**: Log permission errors

### Task 8.2: Responsiveness Testing 
**User Story**: As a platform developer, I want to test the application's responsiveness across devices so that I can ensure a consistent user experience

#### Subtask 8.2.1: Device Simulations
- **User Story**: As a platform developer, I want to use Chrome DevTools to simulate various devices so that I can identify and fix any responsiveness issues
- **Test**: Use Chrome DevTools for mobile/desktop
- **Needs**: Fix UI/layout issues
- **Error Boundaries**: Document responsiveness bugs

### Task 8.3: Security Testing 
**User Story**: As a platform developer, I want to conduct security testing so that I can protect user data and prevent vulnerabilities

#### Subtask 8.3.1: Data Encryption
- **User Story**: As a platform developer, I want to verify that data is encrypted in transit and at rest so that sensitive information remains secure
- **Test**: Verify encryption in transit/at rest
- **Constraints**: Use TLS 1.2+ and AES-256
- **Error Boundaries**: Log insecure configurations

#### Subtask 8.3.2: Vulnerability Scanning
- **User Story**: As a platform developer, I want to scan for common vulnerabilities like SQLi, XSS, and CSRF so that I can address security issues before they are exploited
- **Test**: Check for SQLi, XSS, CSRF
- **Tools**: OWASP ZAP, manual code review
- **Error Boundaries**: Document vulnerabilities

---

## EPIC 9: Optional Enhancements
**Potential Features**:
- **Notifications**: As a platform user, I want to receive email or push alerts about reports in my area so that I can stay informed about important updates
- **City Expansion**: As a platform administrator, I want to dynamically add cities via a ZIP code API so that the platform can expand its coverage without manual updates
- **Report Export**: As a platform user, I want to export reports as PDF or CSV files so that I can save or share information offline
- **Map Visualizations**: As a platform user, I want to see reports displayed on interactive maps so that I can visualize the geographic distribution of incidents
