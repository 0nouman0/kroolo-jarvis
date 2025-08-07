# Policy Review Gap Analyzer

A React-based application with a Neobrutalism theme for legal, compliance, and audit teams to upload policy documents, analyze compliance gaps using Gemini AI, and generate exportable reports. Uses Supabase for secure document storage and PostgreSQL for analysis metadata.

## Setup

1. **Install Dependencies**:
   \\\ash
   npm install
   \\\

2. **Configure Environment**:
   - Create a Supabase project and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to src/.env.
   - Obtain Gemini AI API key and add VITE_GEMINI_API_KEY to src/.env.
   - Create a Supabase storage bucket named policy-documents with RLS.
   - Create a table nalyses in Supabase:
     \\\sql
     CREATE TABLE analyses (
       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       file_path TEXT NOT NULL,
       file_name TEXT NOT NULL,
       analysis_result JSONB,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     \\\

3. **Run the App**:
   \\\ash
   npm run dev
   \\\

## Features
- Upload PDF policy documents to Supabase Storage.
- Extract text using pdf.js and analyze with Gemini AI for compliance gaps.
- Display gaps with severity and remediation suggestions in a Neobrutalist UI.
- Export results as CSV for audit purposes.

## Tech Stack
- React, Vite, Tailwind CSS (Neobrutalism theme)
- Supabase (Storage, PostgreSQL)
- Gemini AI (NLP parsing)
- pdf.js (PDF text extraction)
