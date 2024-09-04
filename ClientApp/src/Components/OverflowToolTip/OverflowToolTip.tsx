import { Tooltip } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';

const OverflowTip = ({ children }) => {
    const [isOverflowed, setIsOverflow] = useState(false);
    const textElementRef = useRef<any>();
    useEffect(() => {
        setIsOverflow(textElementRef.current.scrollWidth > textElementRef.current.clientWidth);
    }, []);
    return (
        <Tooltip title={children} disableHoverListener={!isOverflowed}>
            <div
                ref={textElementRef}
                style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {children}
            </div>
        </Tooltip>
    );
};

export default OverflowTip;