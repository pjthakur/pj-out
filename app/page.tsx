"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X, Mail, Menu, Clock, Check, ChevronLeft, ChevronRight} from 'react-feather';

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    content: string;
}

interface Contact {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface ScheduledEmail {
    id: string;
    subject: string;
    content: string;
    recipients: string[];
    scheduledTime: Date;
    isRecurring: boolean;
    recurringPattern?: 'daily' | 'weekly' | 'monthly';
    optimizedTime?: boolean;
}

interface DraggedItem {
    type: 'template' | 'contact' | 'new-email';
    data: EmailTemplate | Contact | Partial<ScheduledEmail> | null;
}

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    duration?: number;
}

const EmailScheduler: React.FC = () => {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        const scrollStyle = document.createElement('style');
        scrollStyle.innerText = `*{scrollbar-width: thin;scrollbar-color: rgba(194, 122, 255, 0.25) transparent;}`;
        document.head.appendChild(scrollStyle);

        return () => {
            document.head.removeChild(link);
            document.head.removeChild(scrollStyle);
        };
    }, []);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarCollapsed(true);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([]);
    const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
    const [activeTab, setActiveTab] = useState<'contacts' | 'templates'>('contacts');
    const [currentToast, setCurrentToast] = useState<Toast | null>(null);
    const [lastToastContent, setLastToastContent] = useState<string>('');
    const [toastTimeoutId, setToastTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [recentToasts, setRecentToasts] = useState<{[key: string]: number}>({});
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>('09:00');
    const [dragOverTimeSlot, setDragOverTimeSlot] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [emailSubject, setEmailSubject] = useState('');
    const [emailContent, setEmailContent] = useState('');
    const [recipients, setRecipients] = useState<string[]>([]);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringPattern, setRecurringPattern] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
    const [scheduledTime, setScheduledTime] = useState('09:00');

    const contacts: Contact[] = [
        { id: '1', name: 'Alice Johnson', email: 'alice@abc.com' },
        { id: '2', name: 'Bob Smith', email: 'bob@abc.com' },
        { id: '3', name: 'Carol Davis', email: 'carol@abc.com' },
        { id: '4', name: 'David Wilson', email: 'david@abc.com' },
    ];

    const templates: EmailTemplate[] = [
        { id: '1', name: 'Welcome Email', subject: 'Welcome to our platform!', content: 'Thank you for joining us...' },
        { id: '2', name: 'Follow-up', subject: 'Following up on our conversation', content: 'I wanted to follow up...' },
        { id: '3', name: 'Newsletter', subject: 'Weekly Newsletter', content: 'Here are this week\'s highlights...' },
        { id: '4', name: 'Meeting Reminder', subject: 'Upcoming Meeting Reminder', content: 'This is a reminder about our meeting...' },
    ];

    const showToast = (toast: Omit<Toast, 'id'>) => {
        const toastContent = `${toast.title}-${toast.message}`;
        const currentTime = Date.now();
        
        if (recentToasts[toastContent] && currentTime - recentToasts[toastContent] < 3000) {
            return;
        }
        
        setRecentToasts(prev => ({
            ...prev,
            [toastContent]: currentTime
        }));
        
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newToast: Toast = {
            id,
            duration: 4000,
            ...toast,
        };

        if (toastTimeoutId) {
            clearTimeout(toastTimeoutId);
        }

        setCurrentToast(null);
        setLastToastContent(toastContent);
        
        const showTimeout = setTimeout(() => {
            setCurrentToast(newToast);
            
            const hideTimeout = setTimeout(() => {
                setCurrentToast(prevToast => 
                    prevToast?.id === newToast.id ? null : prevToast
                );
                setRecentToasts(prev => {
                    const cleanupTime = Date.now() - 10000;
                    const cleaned = Object.entries(prev).reduce((acc, [key, timestamp]) => {
                        if (timestamp > cleanupTime) {
                            acc[key] = timestamp;
                        }
                        return acc;
                    }, {} as {[key: string]: number});
                    return cleaned;
                });
                setLastToastContent('');
        }, newToast.duration);
            
            setToastTimeoutId(hideTimeout);
        }, 100);
        
        setToastTimeoutId(showTimeout);
    };

    const removeToast = (id: string) => {
        if (toastTimeoutId) {
            clearTimeout(toastTimeoutId);
            setToastTimeoutId(null);
        }
        
        setCurrentToast(prevToast => 
            prevToast?.id === id ? null : prevToast
        );
        setLastToastContent('');
    };

    const emailsForSelectedDate = useMemo(() => {
        const selectedDay = new Date(selectedDate);
        selectedDay.setHours(0, 0, 0, 0);

        return scheduledEmails.filter((email) => {
            const initialScheduledDate = new Date(email.scheduledTime);
            initialScheduledDate.setHours(0, 0, 0, 0);

            if (selectedDay < initialScheduledDate) {
                return false;
            }

            if (!email.isRecurring) {
                return selectedDay.getTime() === initialScheduledDate.getTime();
            }

            switch (email.recurringPattern) {
                case 'daily':
                    return true;
                case 'weekly':
                    return selectedDay.getDay() === initialScheduledDate.getDay();
                case 'monthly':
                    return selectedDay.getDate() === initialScheduledDate.getDate();
                default:
                    return false;
            }
        });
    }, [scheduledEmails, selectedDate]);

    useEffect(() => {
        return () => {
            if (toastTimeoutId) {
                clearTimeout(toastTimeoutId);
            }
        };
    }, [toastTimeoutId]);

    const ToastNotification: React.FC<{ toast: Toast }> = ({ toast }) => {
        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {

            const timer = setTimeout(() => setIsVisible(true), 50);
            return () => clearTimeout(timer);
        }, []);

        const handleClose = () => {
            removeToast(toast.id);
        };

        const getToastStyles = () => {
            const baseStyles = "flex items-start p-4 rounded-lg shadow-lg border transition-all duration-300 transform";
            const visibilityStyles = isVisible
                ? "translate-x-0 opacity-100 scale-100"
                : "translate-x-full opacity-0 scale-95";

            switch (toast.type) {
                case 'success':
                    return `${baseStyles} ${visibilityStyles} bg-green-50 border-green-200 text-green-800`;
                case 'error':
                    return `${baseStyles} ${visibilityStyles} bg-red-50 border-red-200 text-red-800`;
                case 'warning':
                    return `${baseStyles} ${visibilityStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
                case 'info':
                    return `${baseStyles} ${visibilityStyles} bg-blue-50 border-blue-200 text-blue-800`;
                default:
                    return `${baseStyles} ${visibilityStyles} bg-gray-50 border-gray-200 text-gray-800`;
            }
        };

        const getIcon = () => {
            switch (toast.type) {
                case 'success':
                    return (
                        <CheckCircle/>
                    );
                case 'error':
                    return (
                        <XCircle/>
                    );
                case 'warning':
                    return (
                        <AlertTriangle/>
                    );
                case 'info':
                    return (
                        <Info/>
                    );
            }
        };

        return (
            <div className={getToastStyles()}>
                <div className="flex-shrink-0 mr-3">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{toast.title}</p>
                    <p className="text-sm opacity-90 mt-1">{toast.message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-3 text-gray-700 hover:text-gray-800 transition-colors cursor-pointer"
                >
                    <X/>
                </button>
            </div>
        );
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const CustomDatePicker = () => {
        const formatDate = (date: Date) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        };

        const generateCalendarDays = () => {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - firstDay.getDay());
            
            const days = [];
            const current = new Date(startDate);
            
            for (let i = 0; i < 42; i++) {
                days.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            
            return days;
        };

        const isToday = (date: Date) => {
            const today = new Date();
            return date.toDateString() === today.toDateString();
        };

        const isSameMonth = (date: Date) => {
            return date.getMonth() === selectedDate.getMonth();
        };

        const isSameDate = (date: Date) => {
            return date.toDateString() === selectedDate.toDateString();
        };

        return (
            <div className="relative date-picker-container z-50">
                <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="relative w-full max-w-48 p-2 md:p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 hover:shadow-lg transition-all duration-200 bg-white cursor-pointer flex items-center justify-between"
                    style={{ fontWeight: '500' }}
                >
                    <span className="text-gray-800">{formatDate(selectedDate)}</span>
                    <svg className="w-5 h-5 text-purple-600 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/5 to-pink-600/5 pointer-events-none"></div>
                </button>
                
                {showDatePicker && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] p-4 w-80 max-w-[calc(100vw-2rem)] md:max-w-none">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h3 className="text-lg font-semibold text-gray-900" style={{ fontWeight: '600' }}>
                                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                <div key={index} className="text-center text-sm font-medium text-gray-600 p-2">
                                    {day}
                                </div>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1">
                            {generateCalendarDays().map((day, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedDate(day);
                                        setShowDatePicker(false);
                                    }}
                                    className={`p-2 text-sm rounded-lg transition-all cursor-pointer ${
                                        isSameDate(day)
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold'
                                            : isToday(day)
                                                ? 'bg-purple-100 text-purple-700 font-medium'
                                                : isSameMonth(day)
                                                    ? 'text-gray-700 hover:bg-purple-50'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {day.getDate()}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const CustomTimePicker = () => {
        const generateTimeOptions = () => {
            const times = [];
            for (let hour = 0; hour < 24; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    times.push(timeString);
                }
            }
            return times;
        };

        const timeOptions = generateTimeOptions();

        return (
            <div className="relative time-picker-container">
                <button
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    className="relative w-full p-3 md:p-5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 hover:shadow-lg transition-all duration-200 bg-white cursor-pointer flex items-center justify-between"
                    style={{ fontWeight: '500' }}
                >
                    <span className="text-lg text-gray-800">{scheduledTime}</span>
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/5 to-pink-600/5 pointer-events-none"></div>
                </button>
                
                {showTimePicker && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] w-full max-h-48 md:max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                        {timeOptions.map((time) => (
                            <button
                                key={time}
                                onClick={() => {
                                    setScheduledTime(time);
                                    setSelectedTimeSlot(time);
                                    setShowTimePicker(false);
                                }}
                                className={`w-full p-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer ${
                                    scheduledTime === time
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold'
                                        : 'text-gray-700'
                                }`}
                                style={{ fontWeight: scheduledTime === time ? '600' : '400' }}
                            >
                                {time}
                                {optimalTimes.includes(time) && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        Optimal
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };




    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedTimeSlot) {
                const currentIndex = timeSlots.indexOf(selectedTimeSlot);
                if (e.key === 'ArrowUp' && currentIndex > 0) {
                    e.preventDefault();
                    const newTime = timeSlots[currentIndex - 1];
                    setSelectedTimeSlot(newTime);
                    setScheduledTime(newTime);
                } else if (e.key === 'ArrowDown' && currentIndex < timeSlots.length - 1) {
                    e.preventDefault();
                    const newTime = timeSlots[currentIndex + 1];
                    setSelectedTimeSlot(newTime);
                    setScheduledTime(newTime);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedTimeSlot, timeSlots]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (showDatePicker && !target.closest('.date-picker-container')) {
                setShowDatePicker(false);
            }
            if (showTimePicker && !target.closest('.time-picker-container')) {
                setShowTimePicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDatePicker, showTimePicker]);


    const getOptimalTimes = () => {
        return ['09:00', '14:00', '16:00'];
    };

    const optimalTimes = getOptimalTimes();

    const handleDragStart = (item: DraggedItem, e: React.DragEvent) => {
        if (item.type === 'new-email') {
            const emailData = item.data as Partial<ScheduledEmail>;

            const dragGhost = document.createElement('div');
            dragGhost.style.position = 'absolute';
            dragGhost.style.top = '-1000px';
            dragGhost.className = 'p-3 rounded-lg shadow-lg bg-white border border-purple-400 w-64';

            const iconSVG = <Mail/>;

            dragGhost.innerHTML = `
        <div class="flex items-center">
          ${iconSVG}
          <div class="flex-1">
            <p class="font-semibold text-sm truncate" style="font-family: 'Poppins', sans-serif;">${emailData.subject || 'New Email'}</p>
            <p class="text-xs text-gray-600" style="font-family: 'Poppins', sans-serif;">Scheduling for ${emailData.recipients?.length || 0} recipient(s)</p>
          </div>
        </div>
      `;
            document.body.appendChild(dragGhost);
            e.dataTransfer.setDragImage(dragGhost, 0, 0);

            setTimeout(() => document.body.removeChild(dragGhost), 0);
        }
        setDraggedItem(item);
    };

    const handleDragOver = (e: React.DragEvent, time: string) => {
        e.preventDefault();
        setDragOverTimeSlot(time);
    };

    const handleClearForm = () => {
        setEmailSubject('');
        setEmailContent('');
        setRecipients([]);
        setRecipientEmail('');
        setIsRecurring(false);

        showToast({
            type: 'info',
            title: 'Form Cleared',
            message: 'All fields have been reset',
        });
    };

    const handleDrop = (e: React.DragEvent, timeSlot: string) => {
        e.preventDefault();
        setDragOverTimeSlot(null);
        if (!draggedItem) return;

        const [hours, minutes] = timeSlot.split(':').map(Number);
        const scheduledDate = new Date(selectedDate);
        scheduledDate.setHours(hours, minutes, 0, 0);

        setSelectedTimeSlot(timeSlot);
        setScheduledTime(timeSlot);

        if (draggedItem.type === 'new-email') {
            const emailData = draggedItem.data as Partial<ScheduledEmail>;
            const newEmail: ScheduledEmail = {
                id: Date.now().toString(),
                subject: emailData.subject!,
                content: emailData.content!,
                recipients: emailData.recipients!,
                scheduledTime: scheduledDate,
                isRecurring: emailData.isRecurring!,
                recurringPattern: emailData.isRecurring ? emailData.recurringPattern : undefined,
                optimizedTime: optimalTimes.includes(timeSlot),
            };
            setScheduledEmails(prev => [...prev, newEmail]);
            showToast({
                type: 'success',
                title: 'Email Scheduled',
                message: `Email "${newEmail.subject}" scheduled for ${timeSlot}`,
            });
            handleClearForm();
        }
        else if (draggedItem.type === 'template') {
            const template = draggedItem.data as EmailTemplate;
            setEmailSubject(template.subject);
            setEmailContent(template.content);
            setScheduledTime(timeSlot);
            setSelectedTimeSlot(timeSlot);
            showToast({
                type: 'info',
                title: 'Template Applied',
                message: `"${template.name}" applied. Add recipients and schedule.`,
            });
        }
        else if (draggedItem.type === 'contact') {
            const contact = draggedItem.data as Contact;
            if (!recipients.includes(contact.email)) {
                setRecipients(prev => [...prev, contact.email]);
            }
        }

        setDraggedItem(null);
    };

    const handleScheduleEmail = () => {
        if (!emailSubject || !emailContent || recipients.length === 0) {
            showToast({
                type: 'error',
                title: 'Missing Information',
                message: 'Please fill in all required fields: subject, content, and recipients',
            });
            return;
        }

        const newEmail: ScheduledEmail = {
            id: Date.now().toString(),
            subject: emailSubject,
            content: emailContent,
            recipients: [...recipients],
            scheduledTime: new Date(`${selectedDate.toDateString()} ${scheduledTime}`),
            isRecurring,
            recurringPattern: isRecurring ? recurringPattern : undefined,
            optimizedTime: optimalTimes.includes(scheduledTime),
        };

        setScheduledEmails([...scheduledEmails, newEmail]);

        const recurringText = isRecurring ? ` (${recurringPattern})` : '';
        showToast({
            type: 'success',
            title: 'Email Scheduled',
            message: `Email "${emailSubject}" scheduled for ${scheduledTime}${recurringText} with ${recipients.length} recipient(s)`,
        });

        handleClearForm();
    };

    const removeRecipient = (email: string) => {
        setRecipients(recipients.filter(r => r !== email));
        showToast({
            type: 'info',
            title: 'Recipient Removed',
            message: `${email} has been removed from recipients`,
        });
    };

    const addRecipient = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast({
                type: 'error',
                title: 'Invalid Email',
                message: 'Please enter a valid email address.',
            });
            return;
        }
        if (recipients.includes(email)) {
            showToast({
                type: 'warning',
                title: 'Duplicate Recipient',
                message: `${email} is already in the list.`,
            });
            return;
        }
        setRecipients([...recipients, email]);
        showToast({
            type: 'success',
            title: 'Recipient Added',
            message: `${email} has been added.`,
        });
    };

    function ToggleSidebarButton(inH2: boolean = false) {
        return <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer ${sidebarCollapsed ? 'left-3' : ''} ${!sidebarCollapsed && inH2 ? 'hidden' : ''}`}
        >
            {sidebarCollapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
        </button>;
    }

            return (
            <div className="min-h-screen md:h-screen relative overflow-y-hidden flex flex-col md:flex-row"
                 style={{ 
                     fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                 }}>

                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-gradient-to-br from-pink-400/25 to-orange-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                    <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
                </div>
            <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 space-y-3 max-w-md sm:max-w-md">
                {currentToast && (
                    <ToastNotification key={currentToast.id} toast={currentToast} />
                )}
            </div>

            {isMobile && !sidebarCollapsed && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setSidebarCollapsed(true)}
                />
            )}

            <div
                className={`bg-white border-r border-gray-200 transition-all duration-300 ${
                    isMobile 
                        ? sidebarCollapsed 
                            ? 'hidden' 
                            : 'fixed inset-0 z-40 w-full max-w-sm'
                        : sidebarCollapsed 
                            ? 'hidden items-center' 
                            : 'w-80'
                }`}>
                <div className="px-4 md:px-6 py-3 md:py-5 border-b border-gray-200 h-16 md:h-20 flex items-center">
                    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
                        {!sidebarCollapsed && (
                            <h2 className="text-lg md:text-xl font-semibold text-gray-900" style={{ fontWeight: '600' }}>
                                Quick Access
                            </h2>
                        )}
                        {ToggleSidebarButton()}
                    </div>
                </div>

                {!sidebarCollapsed && (
                    <div className="p-3 md:p-4">
                        <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('contacts')}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeTab === 'contacts'
                                    ? 'bg-white text-purple-700 shadow-sm'
                                    : 'text-gray-700 hover:text-gray-900'
                                }`}
                                style={{ fontWeight: '500' }}
                            >
                                Contacts
                            </button>
                            <button
                                onClick={() => setActiveTab('templates')}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeTab === 'templates'
                                    ? 'bg-white text-purple-700 shadow-sm'
                                    : 'text-gray-700 hover:text-gray-900'
                                }`}
                                style={{ fontWeight: '500' }}
                            >
                                Templates
                            </button>
                        </div>

                        {activeTab === 'contacts' && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-800 mb-3"
                                    style={{ fontWeight: '500' }}>Favorite Contacts</h3>
                                {contacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart({ type: 'contact', data: contact }, e)}
                                        className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-grab active:cursor-grabbing transition-colors"
                                    >
                                        <div
                                            className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3"
                                            style={{ fontWeight: '500' }}>
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate"
                                               style={{ fontWeight: '500' }}>{contact.name}</p>
                                            <p className="text-xs text-gray-600 truncate"
                                               style={{ fontWeight: '400' }}>{contact.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'templates' && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-800 mb-3" style={{ fontWeight: '500' }}>Email
                                    Templates</h3>
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart({ type: 'template', data: template }, e)}
                                        className="p-3 rounded-lg border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 cursor-grab active:cursor-grabbing transition-colors"
                                    >
                                        <p className="text-sm font-medium text-gray-900 mb-1"
                                           style={{ fontWeight: '500' }}>{template.name}</p>
                                        <p className="text-xs text-gray-600 truncate"
                                           style={{ fontWeight: '400' }}>{template.subject}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 min-h-screen md:h-screen">
                <div className="md:col-span-1 lg:col-span-2 backdrop-blur-md bg-white/95 border-r border-white/30 shadow-lg flex flex-col min-h-screen md:h-screen">
                    <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-5 border-b border-gray-200 h-16 md:h-20">
                        <div className="flex items-center min-w-0 flex-1">
                        {ToggleSidebarButton(true)}
                                                        <h2 className="text-lg md:text-xl font-semibold text-gray-900 ml-2 truncate"
                                style={{ fontWeight: '600' }}>Schedule Timeline</h2>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                            <CustomDatePicker />
                        </div>
                    </div>

                    <div className="flex-1 p-2 md:p-4 overflow-y-auto scrollbar-none space-y-2 min-h-0" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                        {timeSlots.map((time) => {
                            const isOptimal = optimalTimes.includes(time);
                            const emailsInSlot = emailsForSelectedDate.filter(email =>
                                email.scheduledTime.toTimeString().startsWith(time)
                            );
                            const hasScheduledEmail = emailsInSlot.length > 0;
                            const isSelected = selectedTimeSlot === time;
                            return (
                                <div
                                    key={time}
                                    onClick={() => {
                                        setSelectedTimeSlot(time);
                                        setScheduledTime(time);
                                        showToast({
                                            type: 'info',
                                            title: 'Time Selected',
                                            message: `Preparing new email scheduled for ${time}`,
                                        });
                                    }}
                                    onDragOver={(e) => handleDragOver(e, time)}
                                    onDrop={(e) => handleDrop(e, time)}
                                    className={`p-3 rounded-lg border-2 transition-all mb-4 cursor-pointer 
                    ${isSelected ? 'border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 shadow-md' : 
                      isOptimal ? 'border-green-300 bg-green-50 border-dashed' : 
                      hasScheduledEmail ? 'bg-blue-50 border-blue-300 border-dashed' : 
                      'border-gray-200 border-dashed'} 
                                        ${dragOverTimeSlot === time ? 'border-purple-400 bg-purple-50' : ''}
                    ${!isSelected ? 'hover:border-purple-400 hover:bg-purple-50' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isSelected ? 'text-purple-800' : 'text-gray-800'}`}
                          style={{ fontWeight: isSelected ? '600' : '500' }}>{time}</span>
                                        <div className="flex items-center space-x-2">
                                            {isSelected && (
                                                <span
                                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-200 text-purple-800"
                                                    style={{ fontWeight: '500' }}>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd" />
                          </svg>
                          Selected
                        </span>
                                            )}
                                            {isOptimal && (
                                                <span
                                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                                    style={{ fontWeight: '500' }}>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd" />
                          </svg>
                          Optimal
                        </span>
                                            )}
                                            {hasScheduledEmail && (
                                                <span
                                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                    style={{ fontWeight: '500' }}>
                          Scheduled
                        </span>
                                            )}
                                        </div>
                                    </div>
                                    {hasScheduledEmail && (
                                        <div className="mt-2 space-y-1">
                                            {emailsInSlot.map(email => (
                                                <div key={email.id} className="text-xs text-gray-700 truncate bg-white p-1.5 rounded"
                                                     style={{ fontWeight: '400' }}>
                                                    {email.subject}
                                                    {email.isRecurring && (
                                                        <span
                                                            className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                                                            style={{ fontWeight: '500' }}>
                                                                    Recurring
                                                                </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="md:col-span-1 lg:col-span-3 backdrop-blur-md bg-white/95 shadow-lg h-full flex flex-col min-h-screen md:h-screen overflow-y-scroll">
                    <div className="px-4 md:px-6 py-3 md:py-5 border-b border-gray-200 h-16 md:h-20 flex items-center">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-900" style={{ fontWeight: '600' }}>Compose &
                            Schedule</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto relative">
                        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-8">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-800 mb-2"
                                       style={{ fontWeight: '500' }}>
                                    Recipients
                                    <span className="ml-2 text-xs text-gray-700 font-normal">(Drag contacts here or type emails)</span>
                                </label>
                                <div
                                    className="flex flex-wrap gap-2 mb-2 min-h-10 border-2 border-dashed border-gray-200 rounded-lg p-2"
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add('border-purple-400', 'bg-purple-50');
                                    }}
                                    onDragLeave={(e) => {
                                        e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50');
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50');
                                        if (draggedItem?.type === 'contact') {
                                            const contact = draggedItem.data as Contact;
                                            if (!recipients.includes(contact.email)) {
                                                setRecipients([...recipients, contact.email]);
                                            }
                                        }
                                    }}>
                                    {recipients.length === 0 && (
                                        <div className="text-sm text-gray-600 w-full text-center py-2">
                                            Drop contacts here or type email addresses below
                                        </div>
                                    )}
                                    {recipients.map((email) => (
                                        <span
                                            key={email}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                                            style={{ fontWeight: '500' }}
                                        >
                      {email}
                                            <button
                                                onClick={() => removeRecipient(email)}
                                                className="ml-2 text-purple-600 hover:text-purple-800 cursor-pointer"
                                            >
                        ×
                      </button>
                    </span>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={recipientEmail}
                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                        placeholder="example@abc.com"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-transparent pr-24"
                                        style={{ fontWeight: '400' }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && recipientEmail.trim()) {
                                                e.preventDefault();
                                                const email = recipientEmail.trim();
                                                addRecipient(email);
                                                setRecipientEmail('');
                                            }
                                        }}
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded flex items-center">
                      Press Enter to Add
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                <span className="block w-full text-sm font-medium text-gray-800 mb-2"
                      style={{ fontWeight: '500' }}>
                  Templates
                  <span className="ml-2 w-full text-xs text-gray-700 font-normal">(Click templates to apply)</span>
                </span>
                                <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                                    {templates.map((template) => (
                                        <div
                                            key={template.id}
                                            onClick={() => {
                                                setEmailSubject(template.subject);
                                                setEmailContent(template.content);
                                                showToast({
                                                    type: 'success',
                                                    title: 'Template Applied',
                                                    message: `"${template.name}" template applied`,
                                                });
                                            }}
                                            className="flex-shrink-0 p-3 px-5 rounded-lg border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 cursor-pointer transition-colors"
                                        >
                                            <p className="text-sm font-medium text-gray-900 mb-1"
                                               style={{ fontWeight: '500' }}>{template.name}</p>
                                            <p className="text-xs text-gray-600 truncate"
                                               style={{ fontWeight: '400' }}>{template.subject}</p>
                                        </div>
                                    ))}
                                </div>
                                <label className="block text-sm font-medium text-gray-800 mb-2"
                                       style={{ fontWeight: '500' }}>
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    style={{ fontWeight: '400' }}
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-800 mb-2"
                                       style={{ fontWeight: '500' }}>
                                    Message
                                    <span
                                        className="ml-2 text-xs text-gray-700 font-normal">(Drag templates here)</span>
                                </label>
                                <textarea
                                    value={emailContent}
                                    onChange={(e) => setEmailContent(e.target.value)}
                                    placeholder="Compose your email or drag a template here..."
                                    rows={8}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    style={{ fontWeight: '400' }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add('border-purple-400', 'bg-purple-50');
                                    }}
                                    onDragLeave={(e) => {
                                        e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50');
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50');
                                        if (draggedItem?.type === 'template') {
                                            const template = draggedItem.data as EmailTemplate;
                                            setEmailSubject(template.subject);
                                            setEmailContent(template.content);
                                            showToast({
                                                type: 'success',
                                                title: 'Template Applied',
                                                message: `"${template.name}" template applied`,
                                            });
                                        }
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch mb-6">
                                <div className="flex flex-col h-full">
                                    <label className="block text-sm font-medium text-gray-800 mb-2"
                                           style={{ fontWeight: '500' }}>Scheduled Time</label>
                                    <div className="flex flex-col justify-start flex-1">
                                        <div className="mb-3">
                                            <CustomTimePicker />
                                        </div>
                                        {optimalTimes.includes(scheduledTime) && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                                                <div className="flex flex-col items-start">
                                                    <div className={"flex flex-row justify-between p-1"}>
                                                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor"
                                                             viewBox="0 0 20 20">
                                                            <path fillRule="evenodd"
                                                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                  clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-sm text-green-800 font-medium"
                                                              style={{ fontWeight: '500' }}>
                                Great timing!
                              </span>
                                                    </div>
                                                    <p className={"text-xs pl-2"}>This is an optimal send time for higher engagement.</p>
                                                </div>
                                            </div>
                                        )}
                                        {!optimalTimes.includes(scheduledTime) && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                                                 style={{ fontWeight: '400' }}>
                                                <div className="flex items-center mb-2">
                                                    <Clock className="w-4 h-4 text-gray-600 mr-2 flex-shrink-0"/>
                                                    <p className="text-sm font-medium text-gray-700 m-0"
                                                       style={{ fontWeight: '600' }}>
                                                    Optimal Times:
                                                </p>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 mb-2 pl-6"
                                                   style={{ fontWeight: '600' }}>
                                                    {optimalTimes.join(', ')}
                                                </p>
                                                <p className="text-xs text-gray-600 pl-6 leading-relaxed">
                                                    Choose these times for higher engagement rates.
                                                </p>
                                            </div>
                                        )}

                                    </div>
                                </div>

                                <div className="flex flex-col h-full">
                                    <label className="block text-sm font-medium text-gray-800 mb-2"
                                           style={{ fontWeight: '500' }}>Recurring Options</label>
                                    <div className="flex flex-col justify-start space-y-3 flex-1">
                                        <div
                                            onClick={() => setIsRecurring(!isRecurring)}
                                            className="group flex items-center cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                                        >
                                            <div className="relative flex items-center">
                                                <div className={`
                          w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
                          ${isRecurring
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-600'
                                                    : 'border-gray-300 bg-white group-hover:border-purple-400'
                                                }
                        `}>
                                                    {(isRecurring) ? <Check className={"text-white"}/>:''}
                                                </div>

                                                <input
                                                    type="checkbox"
                                                    checked={isRecurring}
                                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                                    className="sr-only"
                                                    aria-label="Enable recurring emails"
                                                />
                                            </div>

                                            <div className="ml-3 flex-1 flex-row justify-between">
                        <span className={`text-sm font-medium transition-colors ${isRecurring ? 'text-purple-700' : 'text-gray-700 group-hover:text-purple-600'
                        }`} style={{ fontWeight: '500' }}>
                          Enable Recurring
                        </span>
                                                                                                    <p className="text-xs text-gray-600 mt-0.5" style={{ fontWeight: '400' }}>
                                                    Send this email on a regular interval
                                                </p>
                                            </div>

                                            <div className={`w-2 h-2 rounded-full transition-all duration-200 ${isRecurring ? 'bg-green-400' : 'bg-gray-300'
                                            }`} />
                                        </div>

                                        {isRecurring && (
                                            <div className="animate-in slide-in-from-top-2 duration-300">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    {[
                                                        {
                                                            value: 'daily',
                                                            label: 'Daily',
                                                        },
                                                        {
                                                            value: 'weekly',
                                                            label: 'Weekly',
                                                        },
                                                        {
                                                            value: 'monthly',
                                                            label: 'Monthly',
                                                        }
                                                    ].map((option) => (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => setRecurringPattern(option.value as 'daily' | 'weekly' | 'monthly')}
                                                            className={`
                                p-2 rounded-lg border text-xs font-medium transition-all duration-200 flex flex-col items-center space-y-1 cursor-pointer
                                ${recurringPattern === option.value
                                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-md'
                                                                : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                                            }
                              `}
                                                            style={{ fontWeight: '500' }}
                                                        >
                                                            <span>{option.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                                <button
                                    onClick={handleScheduleEmail}
                                    draggable={!(!emailSubject || !emailContent || recipients.length === 0)}
                                    onDragStart={(e) => {
                                        if (!emailSubject || !emailContent || recipients.length === 0) return;
                                        handleDragStart({
                                            type: 'new-email',
                                            data: {
                                                subject: emailSubject,
                                                content: emailContent,
                                                recipients: [...recipients],
                                                isRecurring: isRecurring,
                                                recurringPattern: recurringPattern,
                                            }
                                        }, e);
                                    }}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                                    style={{ fontWeight: '500' }}
                                    disabled={!emailSubject || !emailContent || recipients.length === 0}
                                >
                                    Schedule Email
                                </button>
                                <button
                                    onClick={handleClearForm}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors cursor-pointer"
                                    style={{ fontWeight: '500' }}
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="text-center text-xs text-gray-700 -mt-2">
                                Click to schedule immediately or drag the button to a time slot.
                            </div>

                        </div>
                        <div
                            className="fixed bottom-0 left-0 right-0 h-4 bg-gradient-to-t  from-white to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailScheduler;