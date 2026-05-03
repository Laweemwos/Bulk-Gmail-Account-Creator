const puppeteer = require("puppeteer-extra");
StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const { GetSMS, ServiceApiError, TimeoutError, errors } = require('getsms')
const ac = require("@antiadmin/anticaptchaofficial");

// const sms = new GetSMS({
//     key: '177294U15a8640801c39bf11bacebea6d324b6b',
//     url: 'https://smshub.org/stubs/handler_api.php',
//     service: 'smshub'
// });
// ac.setAPIKey('aab6990fa1f86fcb2c441df3bf709048');

// ac.getBalance()
//     .then(balance => console.log('my balance is $' + balance))
//     .catch(error => console.log('received error ' + error))


// let countNrRuim = 0;
const path = require("path");
const fs = require('fs');

const Kazakhstan = 2;
const Philippines = 4;
const Indonesia = 6;
const Kenya = 8;
const Vietnam = 10;
const Kyrgyzstan = 11;
const Usa = 12;
const India = 22;
const Southafrica = 31;
const Romania = 32;
const Uzbekistan = 40;

const pais = Indonesia;

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(
    AdblockerPlugin({
        blockTrackers: true,
    })
);

const reset = "\x1b[0m";

const log = {
    green: (text) => console.log("\x1b[32m" + text + reset),
    red: (text) => console.log("\x1b[31m" + text + reset),
    blue: (text) => console.log("\x1b[34m" + text + reset),
    yellow: (text) => console.log("\x1b[33m" + text + reset),
};

page = null;
browser = null;
async function crawler(email, senha, emailRec) {
    browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: [
            "--disable-extensions",
            "--enable-automation"
        ],
        args: [
            '--disable-blink-features=AutomationControlled',
            '--window-size=650,700',
            '--window-position=1921,0',
            //  '--disable-extensions-except=./plugin',
            '--load-extension=D:\\TestarEmail\\plugin'
            // '--incognito',
            //'--proxy-server=la.residential.rayobyte.com:8000',
            //  "--start-maximized",
            //  "--no-sandbox",
            //  "--disable-setuid-sandbox",
            //  "--user-data-dir=F:\\data",
            //  '--enable-automation', '--disable-extensions', '--disable-default-apps', '--disable-component-extensions-with-background-pages'
        ],
    });
    page = await browser.newPage();



    /*await page.authenticate({        
        username: 'succxulicorbernal_gmail_com',
        password: 'tq45WY2ZlZGoJ'
    })*/

    console.log(email);
    await page.setBypassCSP(true);

    let login_link = "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=ARZ0qKL63ywsKcu__CAzxnheuNk7r6RFTtawSsH0q_wAiYO3G235j1qRcYt2dzgrIBQgSBOziriG&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S453605949%3A1710956152061554&theme=glif&ddm=0";

    await page.goto(login_link);


    await page.waitForSelector('input[name="identifier"]');
    await page.type('input[name="identifier"]', email);
    await page.click('#identifierNext > div > button > span');
    await page.waitForSelector('input[name="identifier"]');

    await page.waitForNavigation();
    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/recaptcha?')) {
        log.red('pediu captch TESTE RETIRAR DEPOIS');
        await browser.close();
        return;

        try {
            await page.waitForSelector('#c0 > div > div.antigate_solver.recaptcha.solved');
        } catch (error) {
            try {
                await page.waitForSelector('#c0 > div > div.antigate_solver.recaptcha.solved');
            } catch (error) {
                //log.red('erro no captch:' + email);
                await browser.close();
                await crawler(email, senha, emailRec);
                return;
            }
        }


        //await new Promise(function (resolve) { setTimeout(resolve, 20000) });
        await page.click("#yDmH0d > c-wiz > div > div.eKnrVb > div > div.Z6Ep7d > div > div.F9NWFb > div > div > button > span");
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        try {
            const elemento = await page.$('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(3) > div > div > div > div.OyEIQ.uSvLId > div:nth-child(2)');
            if (elemento != null) {
                //log.red('erro no captch:' + email);
                await browser.close();
                await crawler(email, senha, emailRec);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        log.green('Conta sem captcha'); 
        await browser.close();
        return
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/rejected?')) {
        log.red('rejected');
        await browser.close();
        return;
    }

    await page.waitForSelector('#passwordNext > div > button > span');
    await new Promise(function (resolve) { setTimeout(resolve, 2000) });
    await page.type('input[name="identifier"]', senha);
    await page.click('#passwordNext > div > button > span');
    try {
        await page.waitForNavigation();
    } catch (error) {

    }

    if (page.url().includes('https://gds.google.com/web/chip?')) {
        log.green('OK');
        await browser.close();
        return;
    }
    if (page.url().includes('https://mail.google.com/mail/u/0/#inbox')) {
        log.green('OK');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/speedbump/idvreenable?')) {
        console.log('Pedindo SMS');
        await getSMSNumber();
        return;
    }

    if (page.url().includes('https://myaccount.google.com/')) {
        log.green('OK');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/dp?')) {
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        log.red('CADASTROU AUTH');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/selection?TL')) {
        log.yellow('FUNCIONOU CONFIRMAR NOME DO EMAIL');
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3) > div > div.vxx8jf');
    
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        await page.type('input[name="knowledgePreregisteredEmailResponse"]', emailRec);
        await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.Z6Ep7d > div > div.F9NWFb > div > div > button > span');
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
    }

    if (page.url().includes('https://accounts.google.com/speedbump/idvreenable?')) {
        console.log('Pedindo SMS');
        await getSMSNumber();
        return;
    }

    if (page.url().includes('https://accounts.google.com/signin/v2/disabled/')) {
        log.red('CONTA BANIDA');
        await browser.close();
        return;
    }


    // await browser.close();
}
module.exports = {sms}
async function TestarEmail() {
    fs.readFile('emailtestar.txt', 'utf8', async (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }


        // Dividir as linhas em um array
        const linhas = data.split('\n');

        await percorrerLista(linhas);
    });
}

async function percorrerLista(lista) {
    for (const item of lista) {
        const [email, senha, emailRec] = item.split(':');
        // Aqui você pode fazer o que quiser com os valores de email e senha
        if (email.trim() == '') {
            return;
        }
        countNrRuim = 0;
        await crawler(email, senha, emailRec, emailRec);
    }
    console.log('Todos os itens foram processados.');
}

// Ch
//TestarEmail();

async function getSMSNumber() {
    try {


        const { balance_number } = await sms.getBalance()
        if (balance_number > 0) {
            //console.log('Balance:' + balance_number);

            //console.log('Aguardando número...');
            const { id, number } = await sms.getNumber('go', 'any', pais);

            //console.log('Number ID:', id)
            //console.log('Number:', number);

            await page.type('#deviceAddress', number);


            const index = await getIndiceByPais(pais);
            await page.evaluate((index) => {
                const select = document.getElementById('countryList');
                select.selectedIndex = index;
                select.dispatchEvent(new Event('change'));
            }, index);

            await page.click('#next-button');
            await new Promise(function (resolve) { setTimeout(resolve, 3000) });

            try {
                const elemento = await page.$('#error');
                if (elemento != null) {
                    countNrRuim++;
                    if (countNrRuim > 6) {
                        log.red('conta com problema, não recebe sms?');
                        await browser.close();
                        return; 
                    }

                    //log.red('error, provavelmente numero ruim');
                    await sms.setStatus(8, id) // Accept, end
                    await getSMSNumber();
                    return;
                }
            } catch (error) {
                //console.log(error);
            }

            // Set "message has been sent" status
            await sms.setStatus(1, id)

            // Wait for code
            const { code } = await sms.getCode(id, 60000)
            console.log('Code:', code);

            await page.type('#smsUserPin', code);

            await page.click('#next-button');

            await new Promise(function (resolve) { setTimeout(resolve, 6000) });

            if (page.url().includes('https://gds.google.com/web/chip?')) {
                log.green('OK');
                await browser.close();
                return;
            }
            if (page.url().includes('https://mail.google.com/mail/u/0/#inbox')) {
                log.green('OK');
                await browser.close();
                return;
            }

            await sms.setStatus(6, id) // Accept, end
        } else console.log('No money')
    } catch (error) {
        if (error instanceof TimeoutError) {
            console.log('Timeout reached')
        }

        if (error instanceof ServiceApiError) {
            if (error.code === errors.BANNED) {
                console.log(`Banned! Time ${error.banTime}`)
            } else {
                if (error.code == "NO_NUMBERS") {
                    await getSMSNumber();
                } else {
                    console.error(error.code, error.message)
                }
            }
        } else console.error(error)
    }
};


async function getIndiceByPais(pais) {
    if (pais == Kazakhstan) {
        return 111;
    }

    if (pais == Philippines) {
        return 171;
    }

    if (pais == Indonesia) {
        return 100;
    }

    if (pais == Kenya) {
        return 113;
    }

    if (pais == Vietnam) {
        return 236;
    }

    if (pais == Kyrgyzstan) {
        return 116;
    }

    if (pais == Usa) {

        return 230;
    }

    if (pais == India) {
        return 99;
    }

    if (pais == Southafrica) {
        return 194;
    }

    if (pais == Romania) {
        return 177;
    }

    if (pais == Uzbekistan) {
        return 232;
    }
}
