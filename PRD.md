# whisprmail - Anonymous Messaging Application
## Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** July 2025  
**Author:** Product Manager & Full Stack Developer  
**Status:** Draft  

---

## 1. Executive Summary

whisprmail is a full-stack anonymous messaging web application that enables users to receive anonymous messages through unique public links. The platform creates a safe space for honest feedback, anonymous questions, and open communication without revealing sender identities.

Users authenticate through NextAuth, receive a personalized public link (`https://whisprmail.mddanish.me/u/username`), and can view received messages on a private dashboard. Anonymous senders can submit messages without registration, with built-in spam prevention and validation.

The application follows a freemium model with a conversion funnel that encourages message senders to create their own accounts, driving organic user growth through viral mechanics.

---

## 2. Goals & Non-Goals

### 2.1 Goals
- Create a secure, anonymous messaging platform with zero friction for senders
- Implement robust authentication system using NextAuth for receivers
- Provide intuitive dashboard for message management and viewing
- Ensure complete sender anonymity while maintaining receiver accountability
- Build viral growth mechanics through post-submission conversion funnel
- Maintain high security standards with spam prevention and data protection
- Deliver responsive, accessible user experience across all devices

### 2.2 Non-Goals
- Real-time messaging or chat functionality
- Message threading or conversation management
- File/media sharing capabilities
- User-to-user direct messaging
- Advanced message filtering or categorization
- Mobile application development (web-first approach)
- Premium subscription features (Phase 1)

---

## 3. User Stories

### 3.1 Receiver (Authenticated User) Stories
- **As a registered user**, I want to sign up with email/password or social login so I can access the platform securely
- **As a logged-in user**, I want to receive a unique public link so others can send me anonymous messages
- **As a message receiver**, I want to view all my messages in a dashboard so I can read and manage them
- **As a message receiver**, I want to see message timestamps so I know when messages were sent
- **As a message receiver**, I want to delete unwanted messages so I can keep my dashboard clean
- **As a message receiver**, I want to archive messages so I can organize them without permanent deletion
- **As a logged-in user**, I want to copy my public link easily so I can share it on social media or other platforms

### 3.2 Sender (Anonymous User) Stories
- **As an anonymous sender**, I want to access a public link without registration so I can send messages quickly
- **As an anonymous sender**, I want to write and submit messages so I can communicate honestly
- **As an anonymous sender**, I want message validation so I know my message meets requirements
- **As an anonymous sender**, I want to see a success confirmation so I know my message was delivered
- **As an anonymous sender**, I want to be invited to create my own account so I can also receive anonymous messages
- **As an anonymous sender**, I want spam prevention so the platform remains trustworthy

---

## 4. Information Architecture

### 4.1 Frontend Views

#### 4.1.1 Landing Page (`/`)
- Hero section with value proposition
- Call-to-action buttons for sign up/login
- Feature highlights and benefits
- Testimonials or social proof
- Footer with links and legal information

#### 4.1.2 Authentication Pages
- **Sign Up Page (`/auth/signup`):**
  - Email and password fields
  - Social login options (Google, GitHub, etc.)
  - Terms of service and privacy policy links
  - Link to login page

- **Login Page (`/auth/login`):**
  - Email and password fields
  - Social login options
  - "Remember me" checkbox
  - Password reset link
  - Link to sign up page

#### 4.1.3 Dashboard (`/dashboard`)
- Header with user profile and logout option
- Public link display with copy button
- Message list with pagination
- Message actions (archive, delete)
- Statistics (total messages, recent activity)
- Settings access

#### 4.1.4 Public Message Page (`/u/[username]`)
- Minimalist design focusing on message form
- Username display (receiver identifier)
- Message textarea with character counter
- Submit button with loading state
- reCAPTCHA integration
- Success/error message display

#### 4.1.5 Conversion Modal/Popup
- Appears after successful message submission
- Compelling value proposition
- Quick sign-up form
- "Maybe later" option to dismiss
- Social proof or testimonials

### 4.2 Navigation Flow
```
Landing → Auth → Dashboard → Settings
    ↓
Public Link → Message Form → Success → Conversion Modal
```

---

## 5. Wireframe Descriptions

### 5.1 Landing Page Layout
- **Header:** Logo, navigation menu, login/signup buttons
- **Hero Section:** Large headline, subtitle, primary CTA button
- **Features Section:** Three-column layout showcasing key features
- **How It Works:** Step-by-step process illustration
- **Footer:** Links, social media, legal information

### 5.2 Authentication Pages Layout
- **Centered Form:** Maximum 400px width, vertically centered
- **Form Fields:** Stacked inputs with proper spacing
- **Social Login:** Buttons below form fields
- **Alternative Actions:** Links at bottom for switching between login/signup

### 5.3 Dashboard Layout
- **Top Navigation:** Logo, user avatar, settings dropdown
- **Sidebar:** Navigation menu, quick stats, public link section
- **Main Content:** Message feed with cards, pagination controls
- **Message Cards:** Content preview, timestamp, action buttons

### 5.4 Public Message Page Layout
- **Minimal Header:** Logo, receiver's username
- **Centered Form:** Message textarea, character counter
- **Submit Section:** reCAPTCHA, submit button
- **Footer:** Minimal links, powered by branding

### 5.5 Conversion Modal Layout
- **Overlay:** Semi-transparent background
- **Modal Card:** Centered, responsive width
- **Content:** Headline, benefits, quick signup form
- **Actions:** Primary signup button, secondary dismiss option

---

## 6. Data Models

### 6.1 User Model
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required for email auth),
  provider: String (email, google, github),
  providerId: String (for social auth),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  profile: {
    firstName: String,
    lastName: String,
    avatar: String
  },
  settings: {
    emailNotifications: Boolean,
    publicProfileVisible: Boolean
  }
}
```

### 6.2 Message Model
```javascript
{
  _id: ObjectId,
  receiverId: ObjectId (ref: User),
  content: String (required, max 500 chars),
  senderIP: String (hashed for anonymity),
  senderUserAgent: String (hashed),
  createdAt: Date,
  status: String (active, archived, deleted),
  metadata: {
    wordCount: Number,
    sentiment: String,
    flagged: Boolean,
    flagReason: String
  }
}
```

### 6.3 Link Model (Optional - for analytics)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  slug: String (username),
  clicks: Number,
  lastAccessed: Date,
  createdAt: Date,
  isActive: Boolean
}
```

---

## 7. API Endpoints

### 7.1 Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/reset-password` - Password reset

### 7.2 User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update user settings
- `DELETE /api/user/account` - Delete user account

### 7.3 Message Endpoints
- `GET /api/messages` - Get user's messages (paginated)
- `POST /api/messages` - Send anonymous message
- `PUT /api/messages/:id` - Update message status
- `DELETE /api/messages/:id` - Delete message
- `GET /api/messages/stats` - Get message statistics

### 7.4 Public Endpoints
- `GET /api/public/user/:username` - Verify username exists
- `POST /api/public/message/:username` - Send anonymous message
- `GET /api/public/link/:username` - Get public link info

---

## 8. Authentication Flow with NextAuth

### 8.1 NextAuth Configuration
```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Validate credentials and return user object
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      session.user.username = token.username
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/signup'
  }
})
```

### 8.2 Authentication Flow Steps
1. User accesses protected route
2. NextAuth redirects to login page
3. User chooses authentication method
4. Credentials validated against database
5. Session created and stored
6. User redirected to dashboard
7. Subsequent requests include session token

---

## 9. Validation & Error Handling Rules

### 9.1 Message Validation Rules
- **Content Length:** 1-500 characters
- **Content Type:** Text only, no HTML/scripts
- **Rate Limiting:** Max 5 messages per IP per hour
- **Spam Detection:** Keyword filtering, repeated content detection
- **Profanity Filter:** Configurable word blacklist

### 9.2 User Validation Rules
- **Username:** 3-20 characters, alphanumeric + underscore
- **Email:** Valid email format, unique across platform
- **Password:** Minimum 8 characters, mixed case, numbers

### 9.3 Error Handling Strategy
- **Client-side:** Form validation with immediate feedback
- **Server-side:** Comprehensive validation with detailed error messages
- **Network Errors:** Retry mechanism with exponential backoff
- **Rate Limiting:** Clear messaging about limits and reset time
- **Database Errors:** Graceful fallbacks with user-friendly messages

---

## 10. Frontend-Backend Integration Points

### 10.1 State Management
- **React State:** Local component state for forms and UI
- **NextAuth Session:** Global authentication state
- **API Calls:** Custom hooks for data fetching
- **Error Boundaries:** Global error handling

### 10.2 Data Fetching Strategy
- **Server-side Rendering:** For SEO-critical pages
- **Client-side Fetching:** For dashboard and dynamic content
- **Caching:** Browser caching for static assets
- **Optimistic Updates:** For better user experience

### 10.3 Form Handling
- **Controlled Components:** React controlled inputs
- **Validation:** Real-time client-side validation
- **Submission:** Async form submission with loading states
- **Error Display:** Inline error messages

---

## 11. Security Considerations

### 11.1 Anonymity Protection
- **IP Hashing:** Store hashed IP addresses for rate limiting
- **No Tracking:** No persistent identifiers for anonymous users
- **Data Minimization:** Collect only necessary metadata
- **Secure Storage:** Encrypt sensitive data at rest

### 11.2 Spam Prevention
- **reCAPTCHA:** Google reCAPTCHA v3 integration
- **Rate Limiting:** IP-based and user-based limits
- **Content Filtering:** Automated spam detection
- **Manual Review:** Flagging system for suspicious content

### 11.3 General Security
- **HTTPS:** SSL/TLS encryption for all communications
- **Input Sanitization:** Prevent XSS and injection attacks
- **Authentication:** Secure password hashing with bcrypt
- **Session Management:** Secure session storage and rotation
- **CORS:** Proper cross-origin resource sharing configuration

---

## 12. Milestones & Delivery Plan

### 12.1 Phase 1: Foundation (Weeks 1-2)
- **Week 1:**
  - Project setup and configuration
  - Database schema design
  - NextAuth integration
  - Basic authentication pages

- **Week 2:**
  - User registration and login
  - Dashboard layout
  - Message model implementation
  - Basic CRUD operations

### 12.2 Phase 2: Core Features (Weeks 3-4)
- **Week 3:**
  - Public message page
  - Anonymous message submission
  - Message display in dashboard
  - Form validation and error handling

- **Week 4:**
  - reCAPTCHA integration
  - Message management (archive/delete)
  - Public link generation
  - Responsive design implementation

### 12.3 Phase 3: Enhancement (Weeks 5-6)
- **Week 5:**
  - Conversion modal/popup
  - Analytics and statistics
  - Performance optimization
  - Security hardening

- **Week 6:**
  - Testing and bug fixes
  - Documentation
  - Deployment preparation
  - User acceptance testing

### 12.4 Phase 4: Launch (Week 7)
- Production deployment
- Monitoring setup
- Performance monitoring
- User feedback collection

---

## 13. Assumptions & Risks

### 13.1 Assumptions
- **User Behavior:** Users will share their public links organically
- **Technical:** MongoDB and Next.js will handle expected traffic
- **Security:** reCAPTCHA will effectively prevent spam
- **Growth:** Conversion funnel will drive user acquisition
- **Infrastructure:** Cloud hosting will provide adequate performance

### 13.2 Risk Assessment

#### 13.2.1 Technical Risks
- **Database Performance:** MongoDB queries may slow with large datasets
  - *Mitigation:* Implement proper indexing and query optimization
- **Rate Limiting:** Aggressive rate limiting may impact legitimate users
  - *Mitigation:* Implement intelligent rate limiting with user behavior analysis

#### 13.2.2 Security Risks
- **Spam/Abuse:** Platform may attract malicious users
  - *Mitigation:* Multi-layered spam prevention and content moderation
- **Data Privacy:** Anonymous messaging may be misused
  - *Mitigation:* Clear terms of service and reporting mechanisms

#### 13.2.3 Business Risks
- **User Adoption:** Users may not find the platform valuable
  - *Mitigation:* Comprehensive user testing and feedback incorporation
- **Competition:** Similar platforms may capture market share
  - *Mitigation:* Focus on unique features and superior user experience

#### 13.2.4 Operational Risks
- **Scalability:** Sudden traffic spikes may overwhelm infrastructure
  - *Mitigation:* Auto-scaling configuration and load testing
- **Compliance:** Data protection regulations may impact operations
  - *Mitigation:* Privacy-by-design approach and legal review

---

## 14. Success Metrics

### 14.1 User Engagement Metrics
- **Monthly Active Users (MAU):** Target 10,000+ within 6 months
- **Message Volume:** Target 100,000+ messages within 6 months
- **Conversion Rate:** Target 5%+ anonymous sender to user conversion
- **Retention Rate:** Target 60%+ 30-day retention rate

### 14.2 Technical Performance Metrics
- **Page Load Time:** <2 seconds for all pages
- **API Response Time:** <500ms for all endpoints
- **Uptime:** 99.9% availability
- **Error Rate:** <0.1% for all user actions

### 14.3 Security Metrics
- **Spam Rate:** <1% of total messages
- **Security Incidents:** Zero data breaches
- **False Positive Rate:** <2% for spam detection

---

## 15. Conclusion

whisprmail represents a unique opportunity to create a valuable anonymous messaging platform that prioritizes user privacy while maintaining security and usability. The phased development approach ensures steady progress while allowing for iterative improvements based on user feedback.

The technical architecture leverages modern web technologies to deliver a scalable, secure, and user-friendly experience. The viral growth mechanics built into the conversion funnel provide a sustainable path to user acquisition and platform growth.

Success will be measured through user engagement, technical performance, and security metrics, with continuous monitoring and optimization to ensure the platform meets user needs and business objectives.

---

*This PRD serves as a living document that will be updated as requirements evolve and new insights are gained through development and user testing.*