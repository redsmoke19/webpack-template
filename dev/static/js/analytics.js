function creatAnalytics() {
  let conter = 0;
  let isDestroed = false;

  const listener = () => conter++;

  document.addEventListener('click', listener);

  return {
    destroy() {
      document.removeEventListener('click', listener);
      isDestroed = true;
    },
    getClick() {
      if (isDestroed) {
        return 'Analytics is destroed';
      }
      return conter;
    }
  }
}

window.analytics = creatAnalytics();