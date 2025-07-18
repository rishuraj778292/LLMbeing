import React from 'react';
import { AlertCircle } from 'lucide-react';

const MissingDataBadge = ({ text = "Not added yet" }) => (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
        <AlertCircle className="w-3 h-3 mr-1" />
        {text}
    </div>
);

export default MissingDataBadge;
