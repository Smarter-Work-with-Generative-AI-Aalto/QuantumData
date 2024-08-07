// components/research/ResearchResultsPage.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ResearchSummary from '../research/ResearchSummary';
import IndividualFindings from '../research/IndividualFindings';
import LoadingSkeleton from '../research/LoadingSkeleton';
import Error from '../shared/Error';

const ResearchResultsPage = () => {
    const { t } = useTranslation('common');
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            // Dummy data
            setResults({
                summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                sources: [
                    { title: "Research Document A.pdf", page: "Page 12" },
                    { title: "Research Document B.pdf", page: "Page 3" },
                    { title: "204550454220.doc", page: "Page 5" },
                ],
                findings: [
                    {
                        title: "Research Document A.pdf",
                        page: "Page 12",
                        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                    },
                    {
                        title: "Research Document B.pdf",
                        page: "Page 3",
                        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                    },
                    {
                        title: "204550454220.doc",
                        page: "Page 5",
                        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                    },
                ],
            });
            setLoading(false);
        }, 10000); // Simulate a 2 second delay for the API call
    }, [id]);

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="flex flex-col pb-6">
            <h2 className="text-xl font-semibold mb-2 text-center">
                {t('research-results')}
            </h2>
            {error && <Error message={error} />}
            {results && (
                <>
                    <ResearchSummary summary={results.summary} sources={results.sources} />
                    <IndividualFindings findings={results.findings} />
                </>
            )}
        </div>
    );
};

export default ResearchResultsPage;
