/**
 * MentorAid API Service
 * Handles all communication with the FastAPI backend
 */

const API_BASE_URL = "http://localhost:8000";

export interface StudentInput {
  maritalStatus: number;
  applicationMode: number;
  applicationOrder: number;
  course: number;
  daytimeAttendance: number;
  previousQualification: number;
  nationality: number;
  ageAtEnrollment: number;
  gender: number;
  international: number;
  mothersQualification: number;
  fathersQualification: number;
  mothersOccupation: number;
  fathersOccupation: number;
  displaced: number;
  specialNeeds: number;
  debtor: number;
  tuitionUpToDate: number;
  scholarshipHolder: number;
  curricular1stSemWithoutEval: number;
  curricular2ndSemCredits: number;
  curricular2ndSemEnrolled: number;
  curricular2ndSemEvaluations: number;
  curricular2ndSemGrade: number;
  curricular2ndSemWithoutEval: number;
  unemploymentRate: number;
  inflationRate: number;
  gdp: number;
}

export interface PredictionResponse {
  prediction: string; // "Dropout", "Enrolled", or "Graduate"
  riskLevel: string; // "low", "medium", or "high"
  dropoutProbability: number; // 0-100
  graduationProbability: number; // 0-100
  recommendation: string;
  confidence: number; // 0-1
}

export interface BatchPredictionResponse {
  predictions: PredictionResponse[];
  summary: {
    totalStudents: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
  };
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  scaler_loaded: boolean;
  features_count: number;
  version: string;
}

/**
 * Predict dropout risk for a single student
 */
export async function predictDropoutRisk(
  studentData: StudentInput
): Promise<PredictionResponse> {
  try {
    console.log("API: Sending request to:", `${API_BASE_URL}/api/predict`);
    console.log("API: Request data:", studentData);
    console.log("API: Field count:", Object.keys(studentData).length);
    console.log("API: Fields:", Object.keys(studentData).sort());

    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    console.log("API: Response status:", response.status);
    console.log("API: Response ok:", response.ok);

    if (!response.ok) {
      let errorMessage = "Prediction failed";
      try {
        const error = await response.json();
        console.log("API: Error response:", error);

        // Handle FastAPI validation errors
        if (error.detail) {
          if (Array.isArray(error.detail)) {
            // Validation error with multiple fields
            errorMessage = error.detail
              .map((err: any) => `${err.loc.join(".")}: ${err.msg}`)
              .join(", ");
          } else if (typeof error.detail === "string") {
            errorMessage = error.detail;
          } else {
            errorMessage = JSON.stringify(error.detail);
          }
        } else {
          errorMessage = error.message || JSON.stringify(error);
        }
      } catch (e) {
        console.log("API: Could not parse error as JSON:", e);
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("API: Success response:", data);
    return data;
  } catch (error) {
    console.log("API: Caught error:", error);
    console.log("API: Error type:", typeof error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to API server. Please ensure the backend is running on http://localhost:8000"
      );
    }
    throw error;
  }
}

/**
 * Predict dropout risk for multiple students
 */
export async function predictBatch(
  students: StudentInput[]
): Promise<BatchPredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predict-batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ students }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Batch prediction failed");
  }

  return response.json();
}

/**
 * Check API health status
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Health check failed");
  }

  return response.json();
}

/**
 * Get model information
 */
export async function getModelInfo(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/model-info`);

  if (!response.ok) {
    throw new Error("Failed to fetch model info");
  }

  return response.json();
}
