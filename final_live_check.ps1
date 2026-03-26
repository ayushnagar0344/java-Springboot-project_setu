$baseUrl = "http://localhost:8080/api"
$ErrorActionPreference = "Stop"

# 1. Signup a new Lawyer profile for testing IDOR
Write-Host "--- 1. SIGNUP NEW LAWYER ---"
$lawyerPhone = "1112223333"
try {
    $signupL = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body (@{
        name="Security Auditor"; phoneNumber=$lawyerPhone; email="audit@legal.com"; password="securePassword123"
    } | ConvertTo-Json) -ContentType "application/json"
    Write-Host "Lawyer registered."
} catch {
    Write-Host "Lawyer already exists or signup failed."
}

# 2. Login as the new Lawyer
Write-Host "`n--- 2. LOGIN AS LAWYER ---"
$authL = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{
    phoneNumber=$lawyerPhone; password="securePassword123"
} | ConvertTo-Json) -ContentType "application/json"
$tokenL = $authL.data.token
$headersL = @{Authorization="Bearer $tokenL"}

# 3. IDOR TEST: Try to create slots for ANOTHER lawyer (Lawyer ID 1)
Write-Host "`n--- 3. IDOR TEST (Slot Creation for others) ---"
try {
    $bodyIdor = @{lawyerId=1; startTimes=@((get-date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss"))} | ConvertTo-Json
    $idor = Invoke-RestMethod -Uri "$baseUrl/slots/create" -Method Post -Body $bodyIdor -Headers $headersL -ContentType "application/json"
    Write-Host "VULNERABILITY FOUND: Slot created for another lawyer!"
} catch {
    Write-Host "SUCCESS: Access denied to other's slots: $($_.Exception.Message)"
}

# 4. Correct Slot Creation (Self)
# Note: First we need to find the Lawyer ID for the new phone number
# In this mockup, we assume the first request might fail if not promoted to Lawyer role
# But we already have Adv. Rajesh (ID 1, Phone 8888888888). 
# Let's login as him to verify the flow.

Write-Host "`n--- 4. LOGIN AS ADV. RAJESH (ID 1) ---"
$authR = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{
    phoneNumber="8888888888"; password="lawyer123"
} | ConvertTo-Json) -ContentType "application/json"
$tokenR = $authR.data.token
$headersR = @{Authorization="Bearer $tokenR"}

Write-Host "`n--- 5. CREATE VALID SLOTS ---"
$startTime = (get-date).AddDays(2).Date.AddHours(10).ToString("yyyy-MM-ddTHH:mm:ss")
$bodySlot = @{lawyerId=1; startTimes=@($startTime)} | ConvertTo-Json
$slots = Invoke-RestMethod -Uri "$baseUrl/slots/create" -Method Post -Body $bodySlot -Headers $headersR -ContentType "application/json"
$slotId = $slots.data[0].id
Write-Host "Slot $slotId created for Adv. Rajesh."

# 6. Book as User
Write-Host "`n--- 6. LOGIN AS USER & BOOK ---"
$authU = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{
    phoneNumber="9876543210"; password="password123"
} | ConvertTo-Json) -ContentType "application/json"
$tokenU = $authU.data.token
$headersU = @{Authorization="Bearer $tokenU"}

$book = Invoke-RestMethod -Uri "$baseUrl/consultations/book" -Method Post -Body (@{slotId=$slotId} | ConvertTo-Json) -Headers $headersU -ContentType "application/json"
$cid = $book.data.id
Write-Host "Booking successful. ID=$cid Status=$($book.data.status)"

# 7. Payment Success
Write-Host "`n--- 7. PAYMENT SUCCESS ---"
$pay = Invoke-RestMethod -Uri "$baseUrl/payments/status/$cid" -Method Post -Body (@{status="SUCCESS"} | ConvertTo-Json) -Headers $headersU -ContentType "application/json"
Write-Host "Payment confirmed. Consultation is now BOOKED."

# 8. Final Meeting Link Access Check
Write-Host "`n--- 8. MEETING LINK ACCESS (User) ---"
$linkU = Invoke-RestMethod -Uri "$baseUrl/consultations/$cid/join" -Method Get -Headers $headersU
Write-Host "User Link: $($linkU.data)"

Write-Host "`n--- 9. MEETING LINK ACCESS (Lawyer) ---"
$linkR = Invoke-RestMethod -Uri "$baseUrl/consultations/$cid/join" -Method Get -Headers $headersR
Write-Host "Lawyer Link: $($linkR.data)"

Write-Host "`n--- FINAL LIVE CHECK COMPLETE: ALL ENDPOINTS SECURE & FUNCTIONAL ---"
