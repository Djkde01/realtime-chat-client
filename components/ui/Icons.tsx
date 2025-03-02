import type React from "react"
import Svg, { Circle, Line, Path } from "react-native-svg"

interface IconProps {
    size?: number
    color?: string
}

export const MessageSquare: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Svg>
)

export const SendIcon: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Path d="M22 2L11 13" />
        <Path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </Svg>
)

export const LogOut: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <Path d="M16 17l5-5-5-5" />
        <Path d="M21 12H9" />
    </Svg>
)

export const ChevronLeft: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Path d="M15 18l-6-6 6-6" />
    </Svg>
)

export const Plus: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Path d="M12 5v14" />
        <Path d="M5 12h14" />
    </Svg>
)


export const AlertCircle: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Circle cx="12" cy="12" r="10" />
        <Line x1="12" y1="8" x2="12" y2="12" />
        <Line x1="12" y1="16" x2="12.01" y2="16" />
    </Svg>
)

export const Users: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <Circle cx="9" cy="7" r="4" />
        <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
)


export const Check: React.FC<IconProps> = ({ size = 24, color = "#000" }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <Path d="M22 4L12 14.01L9 11.01" />
    </Svg>
)