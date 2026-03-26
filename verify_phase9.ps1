$baseUrl = "http://localhost:8080/api"
$ErrorActionPreference = "Stop"

Write-Host "--- 1. AUTHENTICATION TEST ---"
$authBody = @{phoneNumber="9876543210"; password="password123"} | ConvertTo-Json
$auth = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $authBody -ContentType "application/json"
$token = $auth.data.token
$headers = @{Authorization="Bearer $token"}
Write-Host "Login Successful. Token: $($token.Substring(0,10))..."

Write-Host "`n--- 2. RESOURCE ACCESS TEST ---"
$lawyers = Invoke-RestMethod -Uri "$baseUrl/lawyers" -Method Get -Headers $headers
$lawyerId = $lawyers.data[0].id
Write-Host "Found Lawyer: $($lawyers.data[0].name) (ID: $lawyerId)"

Write-Host "`n--- 3. SLOT RETRIEVAL TEST ---"
$slots = Invoke-RestMethod -Uri "$baseUrl/slots/$lawyerId" -Method Get -Headers $headers
$slotId = $slots.data[0].id
Write-Host "Available Slot found: $slotId"

Write-Host "`n--- 4. BOOKING TEST (PENDING_PAYMENT) ---"
$bookBody = @{slotId=$slotId} | ConvertTo-Json
$consultation = Invoke-RestMethod -Uri "$baseUrl/consultations/book" -Method Post -Body $bookBody -Headers $headers -ContentType "application/json"
$cid = $consultation.data.id
Write-Host "Consultation Created: ID=$cid, Status=$($consultation.data.status)"

Write-Host "`n--- 5. PRE-PAYMENT MEETING ACCESS TEST ---"
try {
    $join = Invoke-RestMethod -Uri "$baseUrl/consultations/$cid/join" -Method Get -Headers $headers
    Write-Host "ERROR: Meeting link accessible BEFORE payment: $($join.data)"
} catch {
    Write-Host "SUCCESS: Access blocked as expected. Error: $($_.Exception.Message)"
}

Write-Host "`n--- 6. PAYMENT SUCCESS TEST ---"
$payBody = @{status="SUCCESS"} | ConvertTo-Json
$payment = Invoke-RestMethod -Uri "$baseUrl/payments/status/$cid" -Method Post -Body $payBody -Headers $headers -ContentType "application/json"
Write-Host "Payment Status Updated. Consultation Status: $($payment.data.consultationStatus)"

Write-Host "`n--- 7. POST-PAYMENT MEETING ACCESS TEST ---"
$join = Invoke-RestMethod -Uri "$baseUrl/consultations/$cid/join" -Method Get -Headers $headers
Write-Host "SUCCESS: Meeting link retrieved: $($join.data)"

Write-Host "`n--- 8. DOUBLE BOOKING PREVENTION TEST ---"
try {
    $bookDouble = Invoke-RestMethod -Uri "$baseUrl/consultations/book" -Method Post -Body $bookBody -Headers $headers -ContentType "application/json"
    Write-Host "ERROR: Double booking was allowed!"
} catch {
    Write-Host "SUCCESS: Double booking blocked by DB constraint. Error: $($_.Exception.Message)"
}

Write-Host "`n--- PHASE 9 VERIFICATION COMPLETE ---"
