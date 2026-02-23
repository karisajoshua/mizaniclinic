

## Plan: Admin Access + Iris Image Analysis Feature

### Part 1: Admin Access

The admin page at `/admin` already allows `admin@mizaniclinic.com`. The issue is there's no visible link to navigate there. 

**Changes:**
- Add an "Admin" link in the `MobileHeader` navigation for admin users (checking if `user.email` matches admin emails)
- This will appear in both mobile and desktop navigation menus

### Part 2: Iris Image Analysis with AI

This is the core new feature -- allowing users to capture a high-definition iris (eye) image, have it analyzed by AI, and download a PDF report.

**Technology Stack:**
- **Camera Capture**: HTML5 `getUserMedia` API with high-resolution constraints (request rear camera, max resolution) for capturing detailed iris photos
- **AI Analysis**: **Lovable AI Gateway** using `google/gemini-2.5-pro` (best multimodal model for image + text reasoning). The image will be sent as base64 to an edge function that calls Gemini for iridology-style analysis
- **PDF Report**: **jsPDF** library for client-side PDF generation with the analysis results, user info, iris image, and timestamp

**How It Works:**

```text
User Flow:
1. User opens "Iris Analysis" tab in Dashboard
2. Captures or uploads a high-res eye photo
3. Image is sent to Supabase Edge Function
4. Edge Function calls Gemini Vision via Lovable AI Gateway
5. AI returns structured health analysis
6. Results displayed on screen
7. User can download PDF report
```

### Implementation Details

**1. New Edge Function: `supabase/functions/analyze-iris/index.ts`**
- Receives base64 iris image from client
- Sends to Lovable AI Gateway with a medical iridology analysis prompt
- Uses `google/gemini-2.5-pro` for best image understanding
- Returns structured analysis (observations, potential concerns, recommendations)
- Handles rate limits (429) and payment errors (402)

**2. New Component: `src/components/iris/IrisAnalysis.tsx`**
- Camera capture interface using `navigator.mediaDevices.getUserMedia` with HD constraints
- Option to upload an existing photo as alternative
- Image preview before submission
- Loading state during analysis
- Results display with categorized findings

**3. New Component: `src/components/iris/IrisReport.tsx`**
- Displays the AI analysis results in a formatted view
- Download as PDF button using jsPDF
- Includes: patient name, date, iris image, AI observations, recommendations, disclaimer

**4. Dashboard Integration**
- Add new "Iris Scan" tab to the Dashboard alongside existing tabs (Overview, 5 Ways, Team, etc.)
- Uses an Eye icon from lucide-react

**5. New dependency**
- `jspdf` -- for client-side PDF generation

**6. Medical Disclaimer**
- All reports will include a clear disclaimer that this is AI-assisted analysis and not a medical diagnosis
- Users should consult healthcare professionals for actual medical advice

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/MobileHeader.tsx` | Add admin link for admin users |
| `supabase/functions/analyze-iris/index.ts` | New edge function for AI iris analysis |
| `src/components/iris/IrisAnalysis.tsx` | New camera capture + analysis UI |
| `src/components/iris/IrisReport.tsx` | New results display + PDF download |
| `src/pages/Dashboard.tsx` | Add "Iris Scan" tab |
| `supabase/config.toml` | Register new edge function |

