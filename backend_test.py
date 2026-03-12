#!/usr/bin/env python3
"""
PZE Services Backend API Testing Suite
Tests all quote and review endpoints with comprehensive coverage
"""

import requests
import sys
import json
from datetime import datetime
from pathlib import Path
import io
import time
from typing import Dict, Any, Optional

class PZEBackendTester:
    def __init__(self, base_url="https://yard-cleanup-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # Store created items for cleanup/reuse
        self.created_quotes = []
        self.created_reviews = []
        
    def log_result(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ PASS: {name}")
        else:
            print(f"❌ FAIL: {name}")
            if details:
                print(f"   Details: {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Optional[Dict] = None, files: Optional[Dict] = None, 
                 params: Optional[Dict] = None, use_form_data: bool = False) -> tuple[bool, Dict]:
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'} if not files and not use_form_data else {}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == 'POST':
                if files or use_form_data:
                    # For multipart form data (file upload or form data)
                    response = requests.post(url, data=data, files=files, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                if params:
                    response = requests.put(url, params=params, timeout=30)
                else:
                    response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                self.log_result(name, False, f"Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            
            try:
                response_data = response.json()
            except json.JSONDecodeError:
                response_data = {"text": response.text}

            if success:
                self.log_result(name, True)
            else:
                details = f"Expected {expected_status}, got {response.status_code}"
                if 'detail' in response_data:
                    details += f" - {response_data['detail']}"
                self.log_result(name, False, details)

            return success, response_data

        except requests.exceptions.Timeout:
            self.log_result(name, False, "Request timeout (30s)")
            return False, {}
        except requests.exceptions.ConnectionError:
            self.log_result(name, False, "Connection error - backend may be down")
            return False, {}
        except Exception as e:
            self.log_result(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        print("\n=== TESTING HEALTH CHECK ===")
        success, response = self.run_test("Health Check", "GET", "health", 200)
        
        if success:
            if "status" in response and response["status"] == "healthy":
                self.log_result("Health Check - Status OK", True)
            else:
                self.log_result("Health Check - Status Missing", False, "No healthy status in response")

    def test_quote_endpoints(self):
        """Test all quote-related endpoints"""
        print("\n=== TESTING QUOTE ENDPOINTS ===")
        
        # Test 1: Submit quote request (basic)
        quote_data = {
            "name": "John Test Customer",
            "phone": "(555) 123-4567", 
            "service": "Moving",
            "address": "123 Test Street, Taft, CA",
            "description": "Need help moving a 2-bedroom apartment",
            "custom_service": None
        }
        
        success, response = self.run_test(
            "Submit Quote (Basic)", 
            "POST", 
            "quotes", 
            200,
            data=quote_data,
            use_form_data=True
        )
        
        if success and 'id' in response:
            quote_id = response['id']
            self.created_quotes.append(quote_id)
            
            # Verify quote data
            if (response.get('name') == quote_data['name'] and
                response.get('phone') == quote_data['phone'] and
                response.get('service') == quote_data['service'] and
                response.get('status') == 'pending'):
                self.log_result("Quote Data Validation", True)
            else:
                self.log_result("Quote Data Validation", False, "Response data doesn't match input")
        
        # Test 2: Submit quote with file upload (multipart form data)
        quote_data_with_file = {
            "name": "Jane File Customer",
            "phone": "(555) 987-6543",
            "service": "Junk Hauling", 
            "address": "456 File Street, Taft, CA",
            "description": "Large furniture removal with photo attached",
            "custom_service": "Piano removal"
        }
        
        # Create a dummy image file for testing
        test_image = io.BytesIO(b"fake_image_data_for_testing")
        test_image.name = "test_photo.jpg"
        
        files = {'photo': ('test_photo.jpg', test_image, 'image/jpeg')}
        
        success, response = self.run_test(
            "Submit Quote (With File)",
            "POST",
            "quotes",
            200,
            data=quote_data_with_file,
            files=files
        )
        
        if success and 'id' in response:
            quote_id = response['id']
            self.created_quotes.append(quote_id)
            
            # Verify file upload
            if response.get('photo_filename'):
                self.log_result("File Upload Validation", True)
            else:
                self.log_result("File Upload Validation", False, "No photo_filename in response")
        
        # Test 3: Get all quotes
        success, response = self.run_test("Get All Quotes", "GET", "quotes", 200)
        
        if success:
            if isinstance(response, list):
                self.log_result("Quotes List Format", True)
                if len(response) >= len(self.created_quotes):
                    self.log_result("Created Quotes Found", True)
                else:
                    self.log_result("Created Quotes Found", False, f"Expected at least {len(self.created_quotes)} quotes, found {len(response)}")
            else:
                self.log_result("Quotes List Format", False, "Response is not a list")
        
        # Test 4: Get specific quote
        if self.created_quotes:
            quote_id = self.created_quotes[0]
            success, response = self.run_test(f"Get Quote {quote_id}", "GET", f"quotes/{quote_id}", 200)
            
            if success and response.get('id') == quote_id:
                self.log_result("Quote ID Match", True)
            elif success:
                self.log_result("Quote ID Match", False, f"Expected ID {quote_id}, got {response.get('id')}")
        
        # Test 5: Update quote status to "contacted"
        if self.created_quotes:
            quote_id = self.created_quotes[0]
            success, response = self.run_test(
                f"Update Quote Status (contacted)",
                "PUT",
                f"quotes/{quote_id}/status",
                200,
                params={"status": "contacted"}
            )
        
        # Test 6: Update quote status to "completed"
        if len(self.created_quotes) > 1:
            quote_id = self.created_quotes[1]
            success, response = self.run_test(
                f"Update Quote Status (completed)",
                "PUT",
                f"quotes/{quote_id}/status", 
                200,
                params={"status": "completed"}
            )
        
        # Test 7: Test invalid status
        if self.created_quotes:
            quote_id = self.created_quotes[0]
            success, response = self.run_test(
                "Invalid Quote Status",
                "PUT",
                f"quotes/{quote_id}/status",
                400,
                params={"status": "invalid_status"}
            )
        
        # Test 8: Test non-existent quote
        success, response = self.run_test(
            "Get Non-existent Quote",
            "GET",
            "quotes/non-existent-id",
            404
        )

    def test_review_endpoints(self):
        """Test all review-related endpoints"""
        print("\n=== TESTING REVIEW ENDPOINTS ===")
        
        # Test 1: Submit new review
        review_data = {
            "name": "Alice Happy Customer",
            "location": "Taft, CA",
            "review": "Excellent service! The team was professional and efficient. Highly recommend PZE Services for any moving needs."
        }
        
        success, response = self.run_test(
            "Submit Review",
            "POST", 
            "reviews",
            200,
            data=review_data
        )
        
        if success and 'id' in response:
            review_id = response['id']
            self.created_reviews.append(review_id)
            
            # Verify review data
            if (response.get('name') == review_data['name'] and
                response.get('location') == review_data['location'] and
                response.get('review') == review_data['review'] and
                response.get('approved') == False and
                response.get('rating') == 5):  # Default rating
                self.log_result("Review Data Validation", True)
            else:
                self.log_result("Review Data Validation", False, "Response data doesn't match input or defaults")
        
        # Test 2: Submit another review for testing
        review_data_2 = {
            "name": "Bob Satisfied Customer", 
            "location": "Bakersfield, CA",
            "review": "Great junk hauling service. They cleared out my garage quickly and cleanly."
        }
        
        success, response = self.run_test(
            "Submit Second Review",
            "POST",
            "reviews", 
            200,
            data=review_data_2
        )
        
        if success and 'id' in response:
            self.created_reviews.append(response['id'])
        
        # Test 3: Get approved reviews (should be empty initially)
        success, response = self.run_test("Get Approved Reviews", "GET", "reviews", 200)
        
        if success:
            if isinstance(response, list):
                self.log_result("Reviews List Format", True)
                if len(response) == 0:
                    self.log_result("No Approved Reviews Initially", True)
                else:
                    self.log_result("No Approved Reviews Initially", False, f"Expected 0 approved reviews, found {len(response)}")
            else:
                self.log_result("Reviews List Format", False, "Response is not a list")
        
        # Test 4: Get all reviews including pending
        success, response = self.run_test("Get All Reviews (Including Pending)", "GET", "reviews/all", 200)
        
        if success:
            if isinstance(response, list):
                self.log_result("All Reviews List Format", True)
                if len(response) >= len(self.created_reviews):
                    self.log_result("Created Reviews Found", True)
                else:
                    self.log_result("Created Reviews Found", False, f"Expected at least {len(self.created_reviews)} reviews, found {len(response)}")
            else:
                self.log_result("All Reviews List Format", False, "Response is not a list")
        
        # Test 5: Approve a review
        if self.created_reviews:
            review_id = self.created_reviews[0]
            success, response = self.run_test(
                f"Approve Review {review_id}",
                "PUT",
                f"reviews/{review_id}/approve",
                200
            )
            
            # Verify approval worked by checking approved reviews
            if success:
                time.sleep(0.5)  # Brief pause for database consistency
                success_check, approved_reviews = self.run_test(
                    "Check Approved Reviews After Approval",
                    "GET",
                    "reviews",
                    200
                )
                
                if success_check and len(approved_reviews) == 1:
                    self.log_result("Review Approval Verification", True)
                elif success_check:
                    self.log_result("Review Approval Verification", False, f"Expected 1 approved review, found {len(approved_reviews)}")
        
        # Test 6: Delete a review
        if len(self.created_reviews) > 1:
            review_id = self.created_reviews[1]
            success, response = self.run_test(
                f"Delete Review {review_id}",
                "DELETE", 
                f"reviews/{review_id}",
                200
            )
        
        # Test 7: Test non-existent review operations
        success, response = self.run_test(
            "Approve Non-existent Review",
            "PUT",
            "reviews/non-existent-id/approve",
            404
        )
        
        success, response = self.run_test(
            "Delete Non-existent Review", 
            "DELETE",
            "reviews/non-existent-id",
            404
        )

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting PZE Services Backend API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Run test suites
        self.test_health_check()
        self.test_quote_endpoints() 
        self.test_review_endpoints()
        
        # Print final results
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        # Show failures if any
        failures = [r for r in self.test_results if not r['success']]
        if failures:
            print("\n❌ FAILED TESTS:")
            for failure in failures:
                print(f"  • {failure['name']}: {failure['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = PZEBackendTester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n\n⚠️ Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n\n💥 Unexpected error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())