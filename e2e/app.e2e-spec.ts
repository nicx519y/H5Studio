import { H5StudioPage } from './app.po';

describe('h5-studio App', function() {
  let page: H5StudioPage;

  beforeEach(() => {
    page = new H5StudioPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
