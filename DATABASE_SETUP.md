# 🗄️ Database Setup Instructions

## Neon Database Setup

### 1. Create Neon Database Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### 2. Get Database Connection String
1. In your Neon dashboard, go to **Settings** → **Connection Details**
2. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### 3. Set Up Database Schema
1. In your Neon dashboard, go to **SQL Editor**
2. Copy and run the SQL from `schema.sql` file:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis history table
CREATE TABLE IF NOT EXISTS analysis_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  analysis_data JSONB NOT NULL,
  compliance_score INTEGER,
  gaps_found INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_analysis_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_created_at ON analysis_history(created_at DESC);
```

### 4. Configure Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

#### Required Variables:
```
DATABASE_URL=your_neon_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Optional Variables:
```
VITE_API_URL=https://your-app-name.vercel.app
```

### 5. Generate JWT Secret

You can generate a secure JWT secret using:

**Online Generator:**
- Go to [jwt.io](https://jwt.io) → Debugger → Generate a random secret

**Command Line:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 6. Test the Setup

After deploying with the environment variables:

1. Visit your deployed app
2. Try to sign up with a new account
3. Check your Neon database to see if the user was created
4. Try signing in with the account

## 🚨 Important Security Notes

- **Never commit sensitive environment variables to git**
- **Use strong, random JWT secrets in production**
- **Regularly rotate your database credentials**
- **Enable row-level security in Neon for additional protection**

## 📊 Database Tables Structure

### Users Table
- `id` - Primary key
- `email` - Unique user email
- `password_hash` - Bcrypt hashed password
- `user_metadata` - JSON object for additional user data
- `created_at` - Account creation timestamp
- `updated_at` - Last profile update timestamp

### Analysis History Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `title` - Analysis title
- `analysis_data` - Complete analysis results as JSON
- `compliance_score` - Numerical compliance score
- `gaps_found` - Number of gaps identified
- `created_at` - Analysis creation timestamp
- `updated_at` - Last update timestamp
