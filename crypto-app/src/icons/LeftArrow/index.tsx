import { IconProps } from '@/types'

const LeftArrow = ({
  width = 10,
  height = 16,
  color = '#212529',
}: IconProps) => (
  <svg width={width} height={height} fill="none">
    <path
      fill={color}
      d="M9.333 1.416 7.93 0 0 8l7.93 8 1.403-1.416L2.807 8l6.526-6.584Z"
    />
  </svg>
)

export default LeftArrow
