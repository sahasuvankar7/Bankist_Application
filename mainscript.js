'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 2500, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2024-01-07T14:11:59.604Z',
    '2024-01-06T17:01:17.194Z',
    '2024-01-03T23:36:17.929Z',
    '2024-01-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [500, 3400, -150, -790, -3210, -1000, 850, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2024-01-07T16:33:06.386Z',
    '2024-01-06T14:43:26.374Z',
    '2024-01-02T18:49:59.371Z',
    '2024-01-01T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [5000, 3400, -150, -790, -3210, -1000, 8500, -30];

const formattedDate = function (date) {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDayPassed(new Date(), date);

  console.log(dayPassed + 'dayPassed');
  // returning date means how many days ago the transfer was done
  if (dayPassed === 0) return 'today';
  if (dayPassed === 1) return 'yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    console.log(dayPassed);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

// formatting currency

const formattedCur = function (acc, movement) {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(movement);
};
// display movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  // implementing sorting function

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[index]);

    const displayDate = formattedDate(date, acc.locale);
    //calling formatted currency function
    const formattedMov = formattedCur(acc, movement);

    const html = `  <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    }${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

// coverting money

const usdToINR = 82.5;
// const movementsUSD = containerMovements.map(mov => mov * usdToINR);

const movementsUSD = movements => {
  movements.map(mov => mov * usdToINR);
};
movementsUSD(account1.movements);

// computing username
const createUsernames = (user, account) => {
  const username = user.toLowerCase().split(' ');
  /*
  s
  t
  w
  */
  let loginUserName = '';
  username.map(curr => {
    const str = curr.slice(0, 1);
    loginUserName += str;
    //  console.log(str);
  });
  account.username = loginUserName;
  console.log(loginUserName); // stw
};
//calling username
const callingUserName = function () {
  accounts.map(account => {
    createUsernames(account.owner, account);
    // account.username = shortUsername;
  });
};
// console.log(uname);

callingUserName();

// updating the UI
const updateUI = function (currAcc) {
  //Display movements
  displayMovements(currAcc);

  // Display Total balance
  calcDisplayBalance(currAcc);
  // Display summary
  calcDisplaySummary(currAcc);
};

// all deposites
const totalDeposites = [];
accounts.map(currentAccount => {
  totalDeposites.push(
    currentAccount.movements.filter(movement => {
      return movement > 0;
    })
  );
});
// console.log(totalDeposites);

// calculating total balance

// const totalBalance = [];
const calcDisplayBalance = function (currAcc) {
  currAcc.balance = currAcc.movements.reduce((accu, cur) => accu + cur, 0);
  // labelBalance.textContent = `${currAcc.balance.toFixed(2)} $`;
  labelBalance.textContent = `${formattedCur(currAcc, currAcc.balance)}`;
};

// converting the total amount of balance from dollar to rupees
// it's a chainning method of PIPELINING

const totalDepositsINR = movements
  .filter(mov => mov > 0)
  .map(mov => mov * usdToINR)
  .reduce((acc, cur) => acc + cur, 0);
// console.log(totalDepositsINR);

const calcDisplaySummary = function (account) {
  // for income summary
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formattedCur(account, income);
  // for outcome summary
  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = Math.abs(formattedCur(account, outcome));

  // for interest summary
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formattedCur(account, interest);
};

// implmenting the timer

const startToLogout = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      //Display UI
      labelWelcome.textContent = 'Log in to get Started';
      containerApp.style.opacity = 0;
    }

    time--;
  };
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// implementing login button

let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('LOGIN');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // update current time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
    };
    const locale = navigator.language;
    console.log(locale + 'local language haii yee---------------');
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    if (timer) clearInterval(timer);
    timer = startToLogout();
    // update current account
    updateUI(currentAccount);
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
  }
});

// implementing the transfer amount of money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(receiverAccount,amount);

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // console.log('transfer done');
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    // adding current date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // reset timer
    clearInterval(timer);
    timer = startToLogout();

    updateUI(currentAccount);
  }
});

// closing account implementation

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('delete')

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Implementing Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // reset timer
      clearInterval(timer);
      timer = startToLogout();
      // update UI
      
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

const overAllBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overAllBalance);

// implement sort function
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
