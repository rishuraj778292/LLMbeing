import React from 'react';
import { CheckCircle } from 'lucide-react';

const VerifiedBadge = () => (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Verified
    </div>
);

export default VerifiedBadge;
