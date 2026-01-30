import { createContext, useState, useEffect, useContext } from 'react';
import { 
    mockStudents, 
    mockEnquiries, 
    mockPayments, 
    getAdmissionStats, 
    getMonthlyAdmissions, 
    getStatusBreakdown,
    getEnquiryStats,
    getPaymentStats
} from '../data/mockData';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // Helper to initialize from localStorage or fallback to mock
    const initializeState = (key, fallback) => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    };

    const [students, setStudentsState] = useState(() => initializeState('admission_students', mockStudents));
    const [leads, setLeadsState] = useState(() => initializeState('admission_leads', mockEnquiries));
    const [payments, setPaymentsState] = useState(() => initializeState('admission_payments', mockPayments));
    
    // Settings State
    const [settings, setSettingsState] = useState(() => initializeState('admission_settings', {
        courses: [
            { id: 1, name: 'B.Tech Computer Science', code: 'CS01', duration: '4 Years', intake: 120 },
            { id: 2, name: 'B.Tech Mechanical', code: 'ME01', duration: '4 Years', intake: 60 },
            { id: 3, name: 'Bachelor of Business Admin', code: 'BBA', duration: '3 Years', intake: 180 },
            { id: 4, name: 'Master of Business Admin', code: 'MBA', duration: '2 Years', intake: 60 }
        ],
        feeTypes: [
            { id: 1, name: 'Tuition Fee', frequency: 'Yearly', mandatory: true },
            { id: 2, name: 'Hostel Fee', frequency: 'Semester', mandatory: false },
            { id: 3, name: 'Transport Fee', frequency: 'Yearly', mandatory: false }
        ],
        users: [
             { id: 1, name: 'Admin User', email: 'admin@college.edu', role: 'Super Admin', status: 'Active' },
             { id: 2, name: 'Counselor 1', email: 'counselor1@college.edu', role: 'Counselor', status: 'Active' },
             { id: 3, name: 'Accountant', email: 'accounts@college.edu', role: 'Accountant', status: 'Active' } 
        ],
        institute: {
            name: 'Tech Institute of Excellence',
            address: '123, Knowledge Park, Education City',
            email: 'contact@college.edu',
            phone: '+91 98765 43210'
        }
    }));

    // Persistence Effects
    useEffect(() => { localStorage.setItem('admission_students', JSON.stringify(students)); }, [students]);
    useEffect(() => { localStorage.setItem('admission_leads', JSON.stringify(leads)); }, [leads]);
    useEffect(() => { localStorage.setItem('admission_payments', JSON.stringify(payments)); }, [payments]);
    useEffect(() => { localStorage.setItem('admission_settings', JSON.stringify(settings)); }, [settings]);

    // Derived Stats (memoized by function calls when needed, or we can expose helper functions)
    // We expose getters that calculate usually, or pre-calculated objects if they are heavy.
    // Given the scale, calculating on render or exposing helper functions that take current state is fine.

    // Wrappers to update state
    const addStudent = (student) => setStudentsState(prev => [student, ...prev]);
    const updateStudent = (id, updates) => setStudentsState(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    const deleteStudent = (id) => setStudentsState(prev => prev.filter(s => s.id !== id));

    const addLead = (lead) => setLeadsState(prev => [lead, ...prev]);
    const updateLead = (id, updates) => setLeadsState(prev => prev.map(l => l.enquiryId === id ? { ...l, ...updates } : l));
    
    const addPayment = (payment) => setPaymentsState(prev => [payment, ...prev]);

    const updateSettings = (key, value) => setSettingsState(prev => ({ ...prev, [key]: value }));

    const value = {
        students, addStudent, updateStudent, deleteStudent,
        leads, addLead, updateLead,
        payments, addPayment,
        settings, updateSettings,
        // Expose stats helpers with current data
        stats: getAdmissionStats(students),
        monthlyStats: getMonthlyAdmissions(), // This is static mock in original, might want to make dynamic later
        statusBreakdown: getStatusBreakdown(students),
        leadStats: getEnquiryStats(leads),
        paymentStats: getPaymentStats(payments)
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
