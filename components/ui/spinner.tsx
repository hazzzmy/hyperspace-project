import React from 'react'

const spinner = ({height, width}: {height: number, width: number}) => {
  return (
    <div className={`h-${height} w-${width} inline-block rounded-full border-4 border-r-black animate-spin`} role='status'></div>
  )
}

export default spinner