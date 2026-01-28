**🌾 Kisan-Sarthi**
AI-Powered Soil Analysis & Crop Recommendation System

Kisan-Sarthi is a full-stack agriculture intelligence platform designed to help farmers make informed decisions using soil analysis, crop recommendations, document management, and government scheme discovery.

📁 **Project Location**
⚠️ Important:
This project should be stored and executed from the following directory:
**C:/Project/kisan-sarthi**

🚀 **Key Features**

🌱 Soil Analysis
- Upload a soil image or manually input soil data
- Identify:
    - Soil type (Loamy, Clay, Sandy, etc.)
    - Soil health score
    - Nutrient levels:
    - Nitrogen (N)
    - Phosphorus (P)
    - Potassium (K)
    - Sulphur (S)
    - pH value
- Secure per-farmer storage of soil reports

🌾 **Crop Recommendation**

- Crop suitability based on soil nutrients
- Climate compatibility using location data
- Water requirement insights
- Fertilizer recommendations:
    - Urea → Nitrogen
    - DAP / SSP → Phosphorus
    - MOP → Potassium
    - Gypsum → Sulphur
    - Lime → pH correction

📊 **Farmer Dashboard**

- Nutrient visualization using charts & graphs
- Farmer-friendly UI
- Mobile-responsive design

📂 **Document Upload & Management**

- Upload important agricultural documents:
  - Land ownership records
  - Soil test reports
  - Crop insurance documents
  - Government certificates
- Secure storage using Supabase Storage
- Ability to view & delete documents
- Access restricted to the logged-in farmer only

🏛 **Government Scheme Analysis**

- View active government schemes
- Each scheme includes:
  - Eligibility criteria
  - Benefits
  - Required documents
  - Application process
Admin functionality:
- Add new schemes
- Update existing schemes
- Remove outdated schemes

🔐 **Secure Authentication**

- Supabase Authentication
- JWT-based backend authorization
- Complete data isolation per farmer

**⚙️ Environment Variable Setup**
🔧 **Backend (backend/.env)**
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENWEATHER_API_KEY=your_openweather_api_key
GOOGLE_API_KEY=optional_for_ai_or_maps

🎨 **Frontend (frontend/.env)**
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

🏆 **Why Kisan-Sarthi**
✅ Solves real-world farmer problems
✅ End-to-end agriculture assistance platform
✅ Clean UX for non-technical users
✅ Hackathon-ready and startup-scalable
