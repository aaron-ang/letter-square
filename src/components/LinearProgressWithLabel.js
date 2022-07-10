import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
export default function LinearProgressWithLabel(props) {
    return (React.createElement(Box, { sx: { display: "flex", alignItems: "center" } },
        React.createElement(Box, { sx: { width: "50%", mr: 1 } },
            React.createElement(LinearProgress, Object.assign({ variant: "determinate" }, props))),
        React.createElement(Box, { sx: { minWidth: 35 } },
            React.createElement(Typography, { variant: "body2", color: "text.secondary" }, `${Math.round(props.value)}%`))));
}
