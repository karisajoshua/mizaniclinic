
# API Reference

This section documents all API endpoints and integration patterns for the Mizani Clinic Ambassador platform.

## Base Information

### Base URL
```
https://your-supabase-project.supabase.co
```

### Authentication
All API requests require authentication via Supabase Auth:

```javascript
// Include in request headers
Authorization: Bearer <your-jwt-token>
```

### Response Format
All responses follow this structure:

```json
{
  "data": {...},
  "error": null,
  "count": 10,
  "status": 200
}
```

## Authentication Endpoints

### Sign Up
Create a new user account:

```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "data": {
    "full_name": "John Doe",
    "referral_code": "TDSM-AB1234"
  }
}
```

### Sign In
Authenticate existing user:

```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Sign Out
Invalidate user session:

```http
POST /auth/v1/logout
Authorization: Bearer <token>
```

## User Management

### Get User Profile
```http
GET /rest/v1/profiles?id=eq.<user-id>
Authorization: Bearer <token>
```

### Update Profile
```http
PATCH /rest/v1/profiles?id=eq.<user-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Updated Name",
  "phone": "+255712345678"
}
```

## Referral Management

### Get User Referrals
```http
GET /rest/v1/referrals?referrer_id=eq.<user-id>
Authorization: Bearer <token>
```

### Create Referral
```http
POST /rest/v1/referrals
Authorization: Bearer <token>
Content-Type: application/json

{
  "referrer_id": "uuid",
  "referred_id": "uuid",
  "referral_code": "TDSM-AB1234",
  "status": "pending"
}
```

## Commission Tracking

### Get Earnings
```http
GET /rest/v1/commissions?user_id=eq.<user-id>
Authorization: Bearer <token>
```

### Commission Calculation
```http
POST /rest/v1/rpc/calculate_commission
Authorization: Bearer <token>
Content-Type: application/json

{
  "referral_id": "uuid",
  "amount": 100.00,
  "commission_type": "referral"
}
```

## Appointment Management

### Book Appointment
```http
POST /rest/v1/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": "uuid",
  "appointment_date": "2024-01-15T10:00:00Z",
  "service_type": "consultation",
  "notes": "Initial consultation"
}
```

### Get Appointments
```http
GET /rest/v1/appointments?user_id=eq.<user-id>
Authorization: Bearer <token>
```

## Real-time Subscriptions

### Subscribe to Referrals
```javascript
const subscription = supabase
  .channel('referrals')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'referrals',
    filter: `referrer_id=eq.${userId}`
  }, (payload) => {
    console.log('New referral:', payload.new);
  })
  .subscribe();
```

### Subscribe to Earnings
```javascript
const subscription = supabase
  .channel('commissions')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'commissions',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Commission update:', payload);
  })
  .subscribe();
```

## Error Handling

### Common Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Internal server error |

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_REFERRAL_CODE",
    "message": "The provided referral code is invalid or expired",
    "details": {
      "code": "TDSM-INVALID"
    }
  }
}
```

## Rate Limiting

### Limits
- **Authentication**: 10 requests per minute
- **API Calls**: 100 requests per minute per user
- **Real-time**: 50 subscriptions per connection

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @supabase/supabase-js
```

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);
```

### React Integration
```javascript
import { useQuery } from '@tanstack/react-query';

const { data: referrals } = useQuery({
  queryKey: ['referrals', userId],
  queryFn: () => supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', userId)
});
```

## Webhooks

### Webhook Events
- `user.created`: New user registration
- `referral.confirmed`: Successful referral
- `commission.earned`: Commission credited
- `payout.processed`: Payment completed

### Webhook Payload
```json
{
  "event": "referral.confirmed",
  "data": {
    "referral_id": "uuid",
    "referrer_id": "uuid",
    "referred_id": "uuid",
    "commission_amount": 25.00
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## Next Steps

- [Authentication Details →](/api/auth)
- [User Management →](/api/users)
- [Referral System →](/api/referrals)
- [Payment Processing →](/api/payments)
