const {Builder, By,until} = require('selenium-webdriver')
require('selenium-webdriver/chrome')
require('selenium-webdriver/firefox')
require('chromedriver')
require('geckodriver')

let browserName,universityId;

let univCLIArg = process.argv.filter(arg=>arg.includes('--univ'))[0];
let browserCLIArg = process.argv.filter(arg=>arg.includes('--browser'))[0];
if(univCLIArg){universityId =  Number(univCLIArg.split("=").slice(-1).pop());}
if(browserCLIArg){browserName = String(browserCLIArg.split("=").slice(-1).pop());}
universityId = universityId || 1;
browserName = browserName || 'chrome';

const rootURL = 'http://localhost:3000/';

const d = new Builder().forBrowser(browserName).build();
const waitUntilTime = 3000;
let driver, el, actual, expected, child;
const testMapName = 'Jest Test Map';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;
const universityNames = {
    1:'University of Houston-Clear Lake',
    2:'University of Houston',
    3:'University of Houston-Downtown'
}
const universityTestProgramIds = {
    1:64,
    2:143,
    3:69
}
let universityName = universityNames[universityId];
let universityButtonXpath = `//button[text()="${universityName}"]`;
let universityTestProgramId = universityTestProgramIds[universityId];
let programOptionXpath = `//select[@id="program"]//option[@value="${universityTestProgramId}"]`;

console.log(`TESTING ${universityName} in ${browserName}...`);

async function getElementByXpath(xpath) {
    const el = await driver.wait(until.elementLocated(By.xpath(xpath)), waitUntilTime)
    return await driver.wait(until.elementIsVisible(el), waitUntilTime)
  }

  it('should wait for the driver to start', () => {
    return d.then(_d => {
      driver = _d
    });
  });

  it('should initialize the context', async () => {
    await driver.get(rootURL);
  })

  it('should click on Select a Transfer University and see dropdown items containing UHCL link', async () => {
    let universityDropdownXpath = '//a[contains(@class,"dropdown-toggle")]';
    el = await getElementByXpath(universityDropdownXpath);
    await el.click();
    el = await getElementByXpath(universityButtonXpath);
    actual = await el.getText();
    expected = universityName;
    expect(actual).toBe(expected);
  })

it('should load UHCL programs page', async ()=>{
    let uhclTitleXpath = '//h4'
    await el.click();
    el = await getElementByXpath(uhclTitleXpath);
    expected = `Programs: ${universityName}`;
    actual = await el.getText();
    expect(actual).toBe(expected);
})

it('should log in', async () => {
    let loginButtonXpath = '//button[text()="Login"]';
    let emailInputXpath = '//input[@placeholder="Email"]';
    let passwordInputXpath = '//input[@placeholder="Password"]';
    let email = 'matthew.lewis@sjcd.edu';
    let password = 'szw42elk';
    let submitButtonXpath = '//button[text()="Submit"]';
    let visibleEmailXpath = '//div[contains(text(),"matthew.lewis@sjcd.edu")]';
    el = await getElementByXpath(loginButtonXpath);
    await el.click();
    el = await getElementByXpath(emailInputXpath);
    await el.sendKeys(email);
    el = await getElementByXpath(passwordInputXpath);
    await el.sendKeys(password);
    el = await getElementByXpath(submitButtonXpath);
    await el.click();
    el = await getElementByXpath(visibleEmailXpath);
    actual = await el.getText();
    expected = 'matthew.lewis@sjcd.edu';
    expect(actual).toContain(expected);
})

it('should launch create map modal',async () =>{
    let createMapButtonXpath = '//a[contains(text(),"Create")]';
    let modalTitleXpath = '//h5[@class="modal-title"]';
    el = await getElementByXpath(createMapButtonXpath);
    await el.click();
    el = await getElementByXpath(modalTitleXpath);
    actual = await el.getText();
    expected = 'Create new degree map.';
    expect(actual).toContain(expected);
})

it('should create new map', async () => {
    let associatedSelectorXpath = '//select[@id="assocDegree"]';
    let associateOptionXpath = '//select[@id="assocDegree"]//option[@value="3"]';
    let programSelectorXpath = '//select[@id="program"]';
    let nameInputXpath = '//input[@name="name"]';
    let submitButtonXpath = '//button[text()="Submit"]';
    let newMapXpath = `//a[text()="${testMapName}"]`;

    el = await getElementByXpath(associatedSelectorXpath);
    await el.click();
    el = await getElementByXpath(associateOptionXpath);
    await el.click();
    el = await getElementByXpath(programSelectorXpath);
    await el.click();
    el = await getElementByXpath(programOptionXpath);
    await el.click();
    el = await getElementByXpath(nameInputXpath);
    await el.sendKeys(testMapName);
    el = await getElementByXpath(submitButtonXpath);
    await el.click();
    await driver.wait(until.stalenessOf(driver.findElement(By.xpath('//div[@class="modal fade show"]'))));
    el = await getElementByXpath(newMapXpath);
    actual = await el.getText();
    expected = testMapName;
    expect(actual).toBe(expected);
})

/*
it('should close modal', async () => {
    let closeModalButtonXpath = '//button[text()="Close"]';
    el = await getElementByXpath(closeModalButtonXpath);
    await el.click();
    await driver.wait(until.stalenessOf(driver.findElement(By.xpath('//div[@class="modal fade"]'))));
})
*/

it('should delete the map it created', async () => {
    let deleteButtonXpath = `//li[child::a[text()="${testMapName}"]]/span/span[child::span[contains(@id,"delete")]]/span`;
    let confirmDeleteButtonXpath = '//button[@name="delete-map-button"]';
    el = await getElementByXpath(deleteButtonXpath);
    await el.click();
    el = await getElementByXpath(confirmDeleteButtonXpath);
    await el.click();
    await driver.wait(until.stalenessOf(driver.findElement(By.xpath('//div[@class="modal fade"]'))));
    driver.sleep(2); // Wait to make sure React has had time to update DOM after map deletion. TODO: Different solution
    try{
        el = await getElementByXpath(deleteButtonXpath);
        throw new Error('Throw this error if map was not deleted');
    } catch(err){
        if(err.name !== 'TimeoutError'){
            throw new Error(err);
        }
    }
})

it('should logout', async ()=>{
    let logoutButtonXpath = '//button[text()="Logout"]';
    let loginButtonXpath = '//button[text()="Login"]';
    el = await getElementByXpath(logoutButtonXpath);
    await el.click();
    el = await getElementByXpath(loginButtonXpath);
    actual = await el.getText();
    expected = 'Login';
    expect(actual).toBe(expected);
})

it('should close webbrowser', async ()=>{
    driver.quit();
})