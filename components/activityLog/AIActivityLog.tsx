// components/activityLog/ActivityLog.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Loading from '../shared/Loading';
import Error from '../shared/Error';
import toast from 'react-hot-toast';
import Card from '../shared/Card';
import ActivityLogTable from './ActivityLogTable';
// import { formatDate } from '@/utils/formatDate'; // Assuming you have a date formatting utility

interface ActivityLogProps {
    teamId: string;
    teamSlug: string;  // Add teamSlug as a prop
}

const ActivityLog: React.FC<ActivityLogProps> = ({ teamId, teamSlug }) => {  // Include teamSlug in props
    const { t } = useTranslation('common');
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/ai-activity-log?teamId=${teamId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch activity log');
                }
                const data = await response.json();
                setActivities(data);
            } catch (error) {
                console.error('Error fetching activity log:', error);
                toast.error(t('failed-to-fetch-activity-log'));
                setError(`Failed to load activities. Please try again later.`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivities();
    }, [teamId]);

    const handleViewResults = (activityId: string) => {
        // Use teamSlug for the redirection
        window.location.href = `/teams/${teamSlug}/ai-result?id=${activityId}`;
    };

    return (
        <div className="flex flex-col pb-6">
            <h2 className="text-xl font-semibold mb-2">{t('activityLog.title')}</h2>
            {error && <Error message={error} />}
            <Card className="mt-6">
                <Card.Body>
                    {isLoading ? (
                        <Loading />
                    ) : activities.length === 0 ? (
                        <p>{t('activityLog.noActivities')}</p>
                    ) : (
                        <ActivityLogTable activities={activities} onViewResults={handleViewResults} />
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default ActivityLog;