import { LegalizePage } from './app.po';

describe('legalize App', () => {
  let page: LegalizePage;

  beforeEach(() => {
    page = new LegalizePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
