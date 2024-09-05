// components/activityLog/ActivityLogTable.tsx
import React from 'react';
import { useTranslation } from 'next-i18next';
import { Table } from '../shared/table/Table';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface ActivityLogTableProps {
    activities: any[];
    onViewResults: (id: string) => void;
}

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ activities, onViewResults }) => {
    const { t } = useTranslation('common');

    const columns = [
        t('activityLog.table.date'),
        t('activityLog.table.query'),
        t('activityLog.table.status'),
        'Actions',
    ];

    return (
        <Table
            cols={columns}
            body={activities.map((activity) => ({
                id: activity.id, // Ensure unique key
                cells: [
                    { text: new Date(activity.createdAt).toLocaleDateString() },
                    { text: activity.userSearchQuery },
                    { text: activity.status },
                    {
                        element: (
                            <button
                                onClick={() => onViewResults(activity.id)}
                                className="text-blue-500 flex items-center"
                            >
                                {t('view-results')}
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </button>
                        ),
                    },
                ],
            }))}
            noMoreResults={activities.length === 0}
        />
    );
};

export default ActivityLogTable;
