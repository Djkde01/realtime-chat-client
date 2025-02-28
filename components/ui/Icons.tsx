import type React from "react"
import Svg, { Path } from "react-native-svg"

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