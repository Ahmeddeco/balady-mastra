export const SlideUp = (delay: number) => {
  return {
    initial: {
      y: 50,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        delay,
      },
    },
  }
}
export const SlideDown = (delay: number) => {
  return {
    initial: {
      y: -50,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        delay,
      },
    },
  }
}
export const SlideLeft = (delay: number) => {
  return {
    initial: {
      x: 50,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 1,
        delay,
      },
    },
  }
}
export const SlideRight = (delay: number) => {
  return {
    initial: {
      x: -50,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 1,
        delay,
      },
    },
  }
}
