# BookingRoom
## **Auth**

### POST /api/v1/auth/register

```rb
#body
{"name": "user", "email": "user@gmail.com", "password": "user123"}
```

### POST /api/v1/auth/login

```rb
#body
{"name": "user", "password": "user123"}
```

### POST /api/v1/auth/logout

## **Rooms**
### GET /api/v1/rooms
get all rooms
### POST /api/v1/rooms
```rb
#body
{
    "name": "random Room Name",
    "size": 30
}
```
### GET /api/v1/rooms/:id
get detail of room with id

## **Bookings**
### GET /api/v1/bookings
get all bookings
### GET /api/v1/bookings/slot
get room with free slot in that time range
```rb
#body
{
    "start": "2023-05-28T14:20:00.470+00:00",
    "end": "2023-05-28T16:00:03.470+00:00"
}
```
### POST /api/v1/bookings/slot/:id
Booking room in that time slot. Must be valid room and time range.
```rb
#body
{
    "start": "2023-05-28T14:20:00.470+00:00",
    "end": "2023-05-28T16:00:03.470+00:00"
}
```
### DELETE /api/v1/bookings/:id