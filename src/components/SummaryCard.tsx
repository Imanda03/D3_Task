import React from 'react';
import { SummaryCardProps } from '../utils/types';

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, color, metric }) => {
    const colorMap: Record<string, React.CSSProperties> = {
        blue: {
            backgroundColor: '#DBEAFE',
            color: '#1E40AF',
            border: '1px solid #93C5FD'
        },
        red: {
            backgroundColor: '#FECACA',
            color: '#B91C1C',
            border: '1px solid #FCA5A5'
        },
        green: {
            backgroundColor: '#BBF7D0',
            color: '#166534',
            border: '1px solid #86EFAC'
        },
        purple: {
            backgroundColor: '#E9D5FF',
            color: '#6B21A8',
            border: '1px solid #D8B4FE'
        }
    };

    const baseStyle: React.CSSProperties = {
        padding: '1rem',
        borderRadius: '0.5rem',
        ...colorMap[color] || {
            backgroundColor: '#F3F4F6',
            color: '#1F2937',
            border: '1px solid #D1D5DB'
        }
    };

    return (
        <div style={baseStyle}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 500 }}>{title}</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{value}</p>
            {metric && (
                <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.8 }}>
                    ({metric})
                </p>
            )}
        </div>
    );
};
