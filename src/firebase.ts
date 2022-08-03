import {getAnalytics} from 'firebase/analytics';
import {FirebaseApp, initializeApp} from 'firebase/app';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_APP_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_MESSAGING_SENDER_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_MEASUREMENT_ID,
};

export const initFirebase = () => {
    if (firebaseConfig?.projectId) {
        // Initialize Firebase
        return initializeApp(firebaseConfig);
    }
    console.warn('Fail to initialize Firebase');
    return null;
};

export const initAnalytics = (app: FirebaseApp) => {
    if (app && app.name && typeof window !== 'undefined') {
        return getAnalytics(app);
    }
    return null;
};