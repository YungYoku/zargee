export interface Ad {
  type?: string;
  platform?: string;
  renderTo?: string;
  blockId: string;
}

export const renderAd = (ad: Ad) => {
  window.yaContextCb.push(() => {
    Ya.Context.AdvManager.render(ad);
  });
};
