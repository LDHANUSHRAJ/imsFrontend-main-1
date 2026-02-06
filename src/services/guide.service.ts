import api from "./api";
import type { GuideAssignment, StudentProfileExtended, WeeklyLog, GuideFeedback } from "../types";

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'ims_mock_guide_assignments';

const DEFAULT_ASSIGNMENTS: GuideAssignment[] = [
    {
        id: '1',
        studentName: "Ananya Rao",
        studentRegNo: "2347112",
        internshipTitle: "Full Stack Developer Intern",
        companyName: "Infosys",
        status: "IN_PROGRESS",
        guide: "Dr. Prof. Guide",
        feedback: []
    },
    {
        id: '2',
        studentName: "Rahul Mehta",
        studentRegNo: "2347115",
        internshipTitle: "Data Analyst Intern",
        companyName: "Deloitte",
        status: "CLOSURE_SUBMITTED",
        guide: "Dr. Prof. Guide",
        feedback: []
    },
    {
        id: '3',
        studentName: "Karthik N",
        studentRegNo: "2347120",
        internshipTitle: "Software Engineer Intern",
        companyName: "Wipro",
        status: "OVERDUE_LOGS",
        guide: "Dr. Prof. Guide",
        feedback: []
    }
];

// Helper to get or initialize assignments
const getStoredAssignments = (): GuideAssignment[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ASSIGNMENTS));
        return DEFAULT_ASSIGNMENTS;
    }
    return JSON.parse(stored);
};

// Helper to save assignments
const saveAssignments = (assignments: GuideAssignment[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
};

export const GuideService = {
    getAll: async (): Promise<GuideAssignment[]> => {
        await delay(600);
        return getStoredAssignments();
    },

    assignGuide: async (id: string, guideName: string) => {
        await delay(500);
        const assignments = getStoredAssignments();
        const updated = assignments.map(a =>
            a.id === id ? { ...a, guide: guideName, status: 'IN_PROGRESS' as const } : a
        );
        saveAssignments(updated);

        // Also simulate API call if backend were real (optional, keeping for structure)
        // const response = await api.put(`/internships/${id}`, { guide: guideName });
        // return response.data;
        return { success: true };
    },

    addFeedback: async (id: string, feedbackMsg: string) => {
        await delay(500);
        const assignments = getStoredAssignments();
        const newFeedbackEntry = {
            id: Date.now().toString(),
            message: feedbackMsg,
            date: new Date().toISOString().split('T')[0],
            guideName: 'Dr. Prof. Guide' // Mock
        };

        const updated = assignments.map(a => {
            if (a.id === id) {
                const currentFeedback = a.feedback || [];
                return { ...a, feedback: [...currentFeedback, newFeedbackEntry] };
            }
            return a;
        });

        saveAssignments(updated);
        return { success: true, data: newFeedbackEntry };
    },

    updateFeedback: async (internshipId: string, feedbackId: string, newMessage: string) => {
        await delay(500);
        const assignments = getStoredAssignments();

        const updated = assignments.map(a => {
            if (a.id === internshipId && a.feedback) {
                const updatedFeedbackList = a.feedback.map(f =>
                    f.id === feedbackId ? { ...f, message: newMessage } : f
                );
                return { ...a, feedback: updatedFeedbackList };
            }
            return a;
        });

        saveAssignments(updated);
        return { success: true };
    },

    // --- New Methods for Enhanced Portal ---

    getStudentDetails: async (id: string): Promise<StudentProfileExtended> => {
        await delay(500);
        // Sync with local storage state for status consistency
        const assignments = getStoredAssignments();
        const assignment = assignments.find(a => a.id === id);

        // Mock base data
        const baseData = {
            id,
            studentName: id === '2' ? "Rahul Mehta" : "Ananya Rao",
            studentRegNo: id === '2' ? "2347115" : "2347112",
            email: id === '2' ? "rahul.mehta@mba.christuniversity.in" : "ananya.rao@mca.christuniversity.in",
            phone: "+91 9876543210",
            department: "Computer Science",
            internshipTitle: id === '2' ? "Data Analyst Intern" : "Full Stack Developer Intern",
            companyName: id === '2' ? "Deloitte" : "Infosys",
            status: id === '2' ? "CLOSURE_SUBMITTED" : "IN_PROGRESS",
            startDate: "2024-01-10",
            endDate: "2024-06-10",
            logs: [],
            feedback: []
        };

        if (assignment) {
            // Overlay stored data
            return {
                ...baseData,
                status: assignment.status,
                feedback: assignment.feedback || []
            };
        }

        return baseData;
    },

    getStudentLogs: async (_studentId: string): Promise<WeeklyLog[]> => {
        await delay(500);
        return [
            {
                id: 'log-1',
                weekNumber: 1,
                startDate: '2024-01-10',
                endDate: '2024-01-17',
                workSummary: 'Onboarding and setup. Met with the team and understood the project requirements.',
                learningOutcomes: 'Company policies, environment setup, Agile methodology.',
                status: 'APPROVED',
                submissionDate: '2024-01-17',
                guideComments: 'Good start. Keep it up.'
            },
            {
                id: 'log-2',
                weekNumber: 2,
                startDate: '2024-01-18',
                endDate: '2024-01-25',
                workSummary: 'Frontend development with React. Created the initial layout and navigation.',
                learningOutcomes: 'React hooks, Tailwind CSS, Responsive design.',
                status: 'PENDING',
                submissionDate: '2024-01-25'
            },
            {
                id: 'log-3',
                weekNumber: 3,
                startDate: '2024-01-26',
                endDate: '2024-02-02',
                workSummary: 'Backend API integration. Connected the frontend to the Node.js backend.',
                learningOutcomes: 'REST APIs, Axios, Error handling.',
                status: 'SUBMITTED', // Just submitted, needs review
                submissionDate: '2024-02-02'
            }
        ];
    },

    updateLogStatus: async (logId: string, status: 'APPROVED' | 'REJECTED', comments?: string) => {
        await delay(500);
        console.log(`Updated log ${logId} to ${status} with comments: ${comments}`);
        return { success: true, status, comments };
    },

    submitFeedback: async (studentId: string, feedback: GuideFeedback) => {
        await delay(800);
        console.log(`Submitted feedback for ${studentId}:`, feedback);
        return { success: true };
    },

    updateInternshipStatus: async (studentId: string, status: string, reason?: string) => {
        await delay(800);
        console.log(`Updated internship ${studentId} to ${status}. Reason: ${reason}`);

        // Also update local storage
        const assignments = getStoredAssignments();
        const updated = assignments.map(a =>
            a.id === studentId ? { ...a, status: status as any } : a
        );
        saveAssignments(updated);

        return { success: true, status };
    }
};
