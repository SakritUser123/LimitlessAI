# 🔌 LimitlessAI Pro - API Documentation

## Base URL
```
http://localhost:3000/api  (Development)
https://your-domain.com/api  (Production)
```

## Authentication
All endpoints require **Clerk authentication**. Include session in request headers.

---

## 📸 Meal Analysis

### POST `/meal/analyze`
Analyze food photos with AI.

**Request:**
```bash
POST /api/meal/analyze
Content-Type: multipart/form-data

Form Data:
- file: (binary image file, max 10MB)
```

**Response (201 Created):**
```json
{
  "meal": {
    "id": "uuid",
    "user_id": "clerk-user-id",
    "image_url": "https://...",
    "meal_type": "lunch",
    "description": "Grilled chicken with rice",
    "calories": 450,
    "protein": 45,
    "carbs": 50,
    "fat": 12,
    "fiber": 3,
    "items": [...],
    "created_at": "2024-06-17T12:00:00Z"
  },
  "analysis": {
    "foods": [
      {
        "name": "Grilled Chicken",
        "quantity": 150,
        "unit": "g",
        "calories": 250,
        "protein": 45,
        "carbs": 0,
        "fat": 5,
        "fiber": 0,
        "confidence": 95
      }
    ],
    "totalCalories": 450,
    "totalProtein": 45,
    "totalCarbs": 50,
    "totalFat": 12,
    "totalFiber": 3,
    "mealType": "lunch",
    "notes": "High protein meal"
  }
}
```

**Errors:**
- `400 Bad Request` - No file provided
- `400 Bad Request` - File too large (>10MB)
- `401 Unauthorized` - Not authenticated
- `500 Server Error` - OpenAI API error

---

## 🍽️ Meals Management

### GET `/meals`
Get list of meals.

**Query Parameters:**
```
offset: number (default: 0)
limit: number (default: 50)
date: YYYY-MM-DD (optional, filter by date)
```

**Example:**
```bash
GET /api/meals?offset=0&limit=20&date=2024-06-17
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "user_id": "clerk-user-id",
    "meal_type": "breakfast",
    "description": "Eggs and toast",
    "calories": 350,
    "protein": 15,
    "carbs": 35,
    "fat": 12,
    "fiber": 2,
    "image_url": "https://...",
    "created_at": "2024-06-17T08:30:00Z"
  },
  ...
]
```

---

### POST `/meals`
Create a new meal.

**Request:**
```json
{
  "meal_type": "lunch",
  "description": "Tuna salad",
  "calories": 320,
  "protein": 40,
  "carbs": 15,
  "fat": 8,
  "fiber": 4,
  "notes": "From restaurant"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "user_id": "clerk-user-id",
  "meal_type": "lunch",
  "description": "Tuna salad",
  "calories": 320,
  "protein": 40,
  "carbs": 15,
  "fat": 8,
  "fiber": 4,
  "created_at": "2024-06-17T12:30:00Z"
}
```

---

### GET `/meals/[id]`
Get a specific meal.

**Example:**
```bash
GET /api/meals/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "clerk-user-id",
  "meal_type": "lunch",
  "description": "Grilled chicken with rice",
  "calories": 450,
  "protein": 45,
  "carbs": 50,
  "fat": 12,
  "fiber": 3,
  "image_url": "https://...",
  "created_at": "2024-06-17T12:00:00Z"
}
```

**Errors:**
- `404 Not Found` - Meal not found

---

### PUT `/meals/[id]`
Update a meal.

**Request:**
```json
{
  "description": "Updated description",
  "calories": 460
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "description": "Updated description",
  "calories": 460,
  ...
}
```

---

### DELETE `/meals/[id]`
Delete a meal.

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## 📊 Nutrition & Analytics

### GET `/nutrition/today`
Get today's nutrition summary.

**Response (200 OK):**
```json
{
  "date": "2024-06-17",
  "totalCalories": 1850,
  "totalProtein": 120,
  "totalCarbs": 200,
  "totalFat": 60,
  "totalFiber": 18,
  "mealCount": 3
}
```

---

### GET `/analytics`
Get analytics for a period.

**Query Parameters:**
```
days: number (default: 7)
```

**Example:**
```bash
GET /api/analytics?days=7
```

**Response (200 OK):**
```json
{
  "period": {
    "start": "2024-06-10",
    "end": "2024-06-17",
    "days": 7
  },
  "totalMeals": 21,
  "avgCaloriesPerDay": 1900,
  "avgProteinPerDay": 125,
  "data": [
    {
      "date": "2024-06-17",
      "totalCalories": 1850,
      "totalProtein": 120,
      "totalCarbs": 200,
      "totalFat": 60,
      "totalFiber": 18,
      "meals": [...]
    },
    ...
  ]
}
```

---

## 🔐 Authentication

All endpoints check Clerk authentication:

```typescript
const { userId } = auth();
if (!userId) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

Make sure to:
1. Configure Clerk environment variables
2. Initialize Clerk in root layout
3. Login before accessing protected routes

---

## 🛠️ Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```
User not authenticated or session expired.

**400 Bad Request:**
```json
{
  "error": "No file provided"
}
```
Invalid request parameters or missing data.

**404 Not Found:**
```json
{
  "error": "Meal not found"
}
```
Resource doesn't exist or belongs to different user.

**500 Server Error:**
```json
{
  "error": "Failed to analyze meal"
}
```
Server-side error. Check logs.

---

## 📈 Rate Limiting

Currently no rate limiting implemented. For production:

1. Add Upstash Redis:
```bash
npm install @upstash/ratelimit @upstash/redis
```

2. Implement in routes:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});

export async function POST(request: NextRequest) {
  const { success } = await ratelimit.limit("meal-analysis");
  if (!success) {
    return new Response("Rate limited", { status: 429 });
  }
  // ... handler
}
```

---

## 💡 Usage Examples

### cURL
```bash
# Analyze a meal photo
curl -X POST http://localhost:3000/api/meal/analyze \
  -F "file=@meal.jpg" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get meals
curl http://localhost:3000/api/meals \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get analytics
curl "http://localhost:3000/api/analytics?days=7" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### JavaScript/Fetch
```javascript
// Analyze meal
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/api/meal/analyze', {
  method: 'POST',
  body: formData,
});
const result = await response.json();

// Get meals
const mealsResponse = await fetch('/api/meals?limit=20');
const meals = await mealsResponse.json();
```

### Python
```python
import requests

# Analyze meal
files = {'file': open('meal.jpg', 'rb')}
response = requests.post('http://localhost:3000/api/meal/analyze', files=files)
result = response.json()

# Get meals
headers = {'Authorization': f'Bearer {token}'}
response = requests.get('http://localhost:3000/api/meals', headers=headers)
meals = response.json()
```

---

## 📚 Data Models

### Meal
```typescript
{
  id: UUID
  user_id: string (Clerk ID)
  image_url?: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  items?: FoodItem[]
  notes?: string
  created_at: ISO8601
  updated_at: ISO8601
}
```

### FoodItem
```typescript
{
  name: string
  quantity: number
  unit: string (g, cup, oz, ml, etc)
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  confidence: 0-100
}
```

### NutritionSummary
```typescript
{
  date: YYYY-MM-DD
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  totalFiber: number
  mealCount: number
}
```

---

## 🔄 Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Not authenticated |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limited |
| 500 | Server Error - Unexpected error |

---

## 🚀 Performance Tips

1. **Pagination**: Always use `limit` and `offset` for large datasets
2. **Caching**: Responses are cached server-side where appropriate
3. **Compression**: All responses are gzip-compressed
4. **Database**: Queries use indexed columns for speed

---

## 📞 Support

- Check logs: `npm run dev` console
- API docs: This file
- Setup help: [SETUP.md](SETUP.md)
- Deployment: [DEPLOY.md](DEPLOY.md)

---

**Last Updated**: June 17, 2024  
**Version**: 1.0.0  
**Status**: Production Ready
