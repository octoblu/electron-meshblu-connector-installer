import path from 'path';
import chromedriver from 'chromedriver';
import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import electronPath from 'electron-prebuilt';
import homeStyles from '../app/components/Home.css';
import installerStyles from '../app/components/Installer.css';

chromedriver.start(); // on port 9515
process.on('exit', chromedriver.stop);

const delay = time => new Promise(resolve => setTimeout(resolve, time));

describe('main window', function spec() {
  this.timeout(5000);

  before(async () => {
    await delay(1000); // wait chromedriver start time
    this.driver = new webdriver.Builder()
      .usingServer('http://localhost:9515')
      .withCapabilities({
        chromeOptions: {
          binary: electronPath,
          args: [`app=${path.resolve()}`]
        }
      })
      .forBrowser('electron')
      .build();
  });

  after(async () => {
    await this.driver.quit();
  });

  const findInstaller = () => this.driver.findElement(webdriver.By.className(installerStyles.installer));

  const findButtons = () => this.driver.findElements(webdriver.By.className(installerStyles.btn));

  it('should open window', async () => {
    const title = await this.driver.getTitle();
    expect(title).to.equal('Hello Electron React!');
  });

  it('should to Installer with click "to Installer" link', async () => {
    const link = await this.driver.findElement(webdriver.By.css(`.${homeStyles.container} > a`));
    link.click();

    const installer = await findInstaller();
    expect(await installer.getText()).to.equal('0');
  });

  it('should display updated count after increment button click', async () => {
    const buttons = await findButtons();
    buttons[0].click();

    const installer = await findInstaller();
    expect(await installer.getText()).to.equal('1');
  });

  it('should display updated count after descrement button click', async () => {
    const buttons = await findButtons();
    const installer = await findInstaller();

    buttons[1].click();  // -

    expect(await installer.getText()).to.equal('0');
  });

  it('shouldnt change if even and if odd button clicked', async () => {
    const buttons = await findButtons();
    const installer = await findInstaller();
    buttons[2].click();  // odd

    expect(await installer.getText()).to.equal('0');
  });

  it('should change if odd and if odd button clicked', async () => {
    const buttons = await findButtons();
    const installer = await findInstaller();

    buttons[0].click();  // +
    buttons[2].click();  // odd

    expect(await installer.getText()).to.equal('2');
  });

  it('should change if async button clicked and a second later', async () => {
    const buttons = await findButtons();
    const installer = await findInstaller();
    buttons[3].click();  // async

    expect(await installer.getText()).to.equal('2');

    await this.driver.wait(() =>
      installer.getText().then(text => text === '3')
    , 1000, 'count not as expected');
  });

  it('should back to home if back button clicked', async () => {
    const link = await this.driver.findElement(
      webdriver.By.css(`.${installerStyles.backButton} > a`)
    );
    link.click();

    await this.driver.findElement(webdriver.By.className(homeStyles.container));
  });
});
