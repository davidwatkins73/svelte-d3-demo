<defs>
    <linearGradient spreadMethod="pad"
                    id="gradient-in"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%">
        <stop offset="0%"
              style="stop-color:#91dbf1;stop-opacity:1;" />
        <stop offset="100%"
              style="stop-color:#def9fa;stop-opacity:1;" />
    </linearGradient>

    <linearGradient spreadMethod="pad"
                    id="gradient-out"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%">
        <stop offset="0%"
              style="stop-color:#def9fa;stop-opacity:1;" />
        <stop offset="100%"
              style="stop-color:#91dbf1;stop-opacity:1;" />
    </linearGradient>

    <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
    </filter>
</defs>