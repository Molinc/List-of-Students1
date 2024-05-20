document.addEventListener('DOMContentLoaded', async () => {
  const Server_URL = 'http://localhost:3000';

  async function serverAddStudent(obj) {
    const response = await fetch(`${Server_URL}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: obj.name,
        surname: obj.surname,
        lastname: obj.lastname,
        birthday: obj.birthday,
        studyStart: obj.studyStart,
        faculty: obj.faculty,
      }),
    });
    const data = await response.json();
    return data;
  }

  async function serverGetStudent() {
    const response = await fetch(`${Server_URL}/api/students`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data;
  }

  async function serverDeleteStudent(obj) {
    const id = obj;
    const response = await fetch(`${Server_URL}/api/students/${id}`, { method: 'DELETE' });
    const data = await response.json();
    return data;
  }

  // добавление студента

  function initSortListener() {
    const th = document.querySelectorAll('th');
    const listener = (e) => {
      const sorttd = (studentsList, prop, dir = false) => studentsList.sort((a, b) => ((!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 1));

      const currentSort = e.target.getAttribute('data-sort');
      if (!currentSort) {
        e.target.setAttribute('data-sort', 'desc');
      } else if (currentSort === 'desc') {
        e.target.setAttribute('data-sort', 'asc');
      } else {
        e.target.setAttribute('data-sort', 'desc');
      }

      const dir = currentSort === 'desc';

      switch (e.target.getAttribute('data-name')) {
        case 'fio':
          if (studentsList.name) {
            studentsList = sorttd(studentsList, 'name', dir);
            console.log(studentsList);
            renderTable(studentsList);
          } else if (studentsList.surname) {
            studentsList = sorttd(studentsList, 'surname', dir);
            console.log(studentsList);
            renderTable(studentsList);
          } else {
            studentsList = sorttd(studentsList, 'lastname', dir);
            console.log(studentsList);
            renderTable(studentsList);
          }
        case 'faculty':
          studentsList = sorttd(studentsList, 'faculty', dir);
          console.log(studentsList);
          renderTable(studentsList);
        case 'age':
          studentsList = sorttd(studentsList, 'birthday', dir);
          console.log(studentsList);
          renderTable(studentsList);
        case 'year-of-study':
          studentsList = sorttd(studentsList, 'studyStart', dir);
          console.log(studentsList);
          renderTable(studentsList);
      }
    };
    th.forEach((th) => {
      th.removeEventListener('click', listener);
    });
    th.forEach((th) => {
      th.addEventListener('click', listener);
    });
  }

  const serverdata = await serverGetStudent();

  let studentsList = [];

  if (serverdata) {
    studentsList = serverdata;

    renderTable(studentsList);
  }

  const form = document.getElementById('add-form');

  function validateForm() {
    let res = true;

    function createTxError(input, text) {
      const cont = input.parentNode;
      const tx = document.createElement('span');
      tx.textContent = text;
      tx.classList.add('error');
      tx.style.color = 'red';
      cont.append(tx);
    }

    function createTxErrors(select, text) {
      const cont = select.parentNode;
      const tx = document.createElement('span');
      tx.textContent = text;
      tx.classList.add('error');
      tx.style.color = 'red';
      cont.append(tx);
    }

    function createErrorIn(input) {
      input.style.border = '1px solid red';
    }

    function createErrorSt(select) {
      select.style.border = '1px solid red';
    }

    function clearErrorIn(inputs) {
      inputs.forEach((input) => input.removeAttribute('style'));
    }

    function clearErrorSt(selects) {
      selects.forEach((select) => select.removeAttribute('style'));
    }

    clearErrorIn(form.querySelectorAll('input'));
    clearErrorSt(form.querySelectorAll('select'));
    form.querySelectorAll('.error').forEach((item) => item.remove());

    form.querySelectorAll('select').forEach((select) => {
      if (select.value === '') {
        res = false;
        createErrorSt(select);
        createTxErrors(select, 'Выберите факультет');
      }
    });

    form.querySelectorAll('input').forEach((input) => {
      if (input.value === '') {
        res = false;
        createErrorIn(input);
      }

      function checkBirthDate(input) {
        const yearNow = new Date().getFullYear();
        const yearIn = new Date(input.value).getFullYear();
        if (yearIn >= 1900 && yearIn <= yearNow) {
          const res = true;
          return res;
        }
        createErrorIn(input);
        createTxError(input, 'Введите корректную дату рождения');
        const res = false;
        return res;
      }

      switch (input.getAttribute('id')) {
        case 'name':
          if (input.value === '') {
            res = false;
            createTxError(input, 'Введите имя');
            createErrorIn(input);
          }
          break;
        case 'surname':
          if (input.value === '') {
            res = false;
            createTxError(input, 'Введите фамилию');
            createErrorIn(input);
          }
          break;
        case 'lastname':
          if (input.value === '') {
            res = false;
            createTxError(input, 'Введите отчество');
            createErrorIn(input);
          }
          break;
        case 'studyStart':
          const yearNow = new Date().getFullYear();
          if (input.value === '') {
            res = false;
            createTxError(input, 'Введите дату поступления');
            createErrorIn(input);
          } else if (input.value > yearNow) {
            res = false;
            createTxError(input, 'Введите корректную дату поступления');
            createErrorIn(input);
          }
          break;
        case 'birthday':
          if (input.value === '') {
            res = false;
            createErrorIn(input);
            createTxError(input, 'Введите дату рождения');
            return res;
          }
          res = checkBirthDate(input);
      }
    });

    form.querySelectorAll('select').forEach((select) => {
      if (select.value == '') {
        res = false;
        createErrorSt(select);
        return res;
      }
    });
    return res;
  }

  function renderTableTr(obj) {
    const tr = document.createElement('tr');
    tr.classList.add('sort');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    const td5 = document.createElement('td');

    td1.textContent = `${obj.surname} ${obj.name} ${obj.lastname}`;
    td2.textContent = `${obj.faculty}`;

    const datebirthday = obj.birthday;
    function createStrDate(obj) {
      const date = new Date(obj);

      function createAge(date) {
        const td = new Date().getFullYear();
        const age = td - date.getFullYear();
        return age;
      }
      function ageName(age) {
        if (age >= 10 && age <= 20) {
          return 'лет';
        } if (age % 10 === 1) {
          return 'год';
        } if (age % 10 > 1 && age % 10 < 5) {
          return 'года';
        }
        return 'лет';
      }

      function formatDate(date) {
        let dd = date.getDate();
        if (dd < 10) dd = `0${dd}`;

        let mm = date.getMonth() + 1;
        if (mm < 10) mm = `0${mm}`;

        let yy = date.getFullYear();
        if (yy < 10) yy = `0${yy}`;

        return `${dd}.${mm}.${yy}`;
      }

      const age = createAge(date);
      const ageNameStr = ageName(age);
      const fd = formatDate(date);
      const strDate = ` ${fd} (${age} ${ageNameStr})`;

      return strDate;
    }
    td3.textContent = `${createStrDate(obj.birthday)}`;

    function createCouse(obj) {
      const studyStart = Number(obj);
      const studyEnd = Number(studyStart) + 4;
      function nameCouse(studyStart, studyEnd) {
        const currentYear = new Date().getFullYear();
        let course = '';
        if (currentYear > studyEnd) {
          course = `${studyStart}-${studyEnd} (Закончил/а)`;
        } else {
          course = `${studyStart}-${studyEnd} (${currentYear - studyStart} курс)`;
        }
        return course;
      }
      const strCouse = nameCouse(studyStart, studyEnd);
      return strCouse;
    }

    const { studyStart } = obj;

    td4.textContent = createCouse(studyStart);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.classList.add('btn');
    delBtn.classList.add('btn-outline-danger');
    td5.append(delBtn);

    delBtn.addEventListener('click', async () => {
      const id = tr.getAttribute('id');
      serverDeleteStudent(id);
    });

    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    tr.append(td4);
    tr.append(td5);

    const { id } = obj;
    tr.setAttribute('id', id);

    return tr;
  }

  function renderTable(array) {
    const table = document.getElementById('table-body');
    table.innerHTML = '';

    array.forEach((obj) => {
      table.append(renderTableTr(obj));
    });

    initSortListener();
  }

  function clearForm() {
    form.querySelectorAll('input').forEach((input) => input.value = '');
    form.querySelectorAll('select').forEach((select) => select.value = '');
  }

  document.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (validateForm(form)) {
      const i = studentsList.length;
      const student = {
        id: i + 1,
        name: document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        lastname: document.getElementById('lastname').value,
        studyStart: document.getElementById('studyStart').value,
        birthday: new Date(document.getElementById('birthday').value),
        faculty: document.getElementById('faculty').value,
      };
      clearForm();
      const serverGetObj = await serverGetStudent();
      const serverAddObj = await serverAddStudent(student);
      serverAddObj.birthday = new Date(serverAddObj.birthday);
      studentsList.push(serverGetObj);
      const $table = document.getElementById('table-body');
      studentsList.forEach((serverGetObj) => {
        $table.appendChild(renderTableTr(serverGetObj));
      });
    }
  });

  function filterArray(arr, key, val) {
    const table = document.getElementById('table-body');
    switch (key) {
      case 'search-fio':
        return arr.filter((object) => {
          const fio = `${object.surname} ${object.name} ${object.lastname}`;
          table.innerHTML = '';
          return fio.includes(val);
        });
      case 'search-year-of-admission':
        return arr.filter((object) => {
          const yearstudyStart = `${object.studyStart}-${object.studyEnd}`;
          table.innerHTML = '';
          return yearstudyStart.includes(val);
        });
      case 'search-year-of-graduation':
        return arr.filter((object) => {
          const yearstudyEnd = String(Number(object.studyStart) + 4);
          table.innerHTML = '';
          return yearstudyEnd.includes(val);
        });
      case 'search-faculty':
        return arr.filter((object) => {
          const { faculty } = object;
          table.innerHTML = '';
          return faculty.includes(val);
        });
      default:
        return arr.filter((object) => String(object[key]).includes(val));
    }
  }

  document.querySelector('.search').querySelectorAll('.search-input').forEach((input) => {
    input.addEventListener('keyup', async (e) => {
      let arraySort = await serverGetStudent();
      switch (input.getAttribute('id')) {
        case 'search-fio':
          arraySort = filterArray(studentsList, 'search-fio', e.target.value);
          renderTable(arraySort);
          break;
        case 'search-year-of-admission'.trim():
          arraySort = filterArray(studentsList, 'search-year-of-admission', e.target.value);
          renderTable(arraySort);
          break;
        case 'search-year-of-graduation'.trim():
          const studyEnd = e.target.value.length > 0 ? String(Number(e.target.value) - 4) : '';
          arraySort = filterArray(studentsList, 'search-year-of-graduation', e.target.value);
          renderTable(arraySort);
          break;
      }
    });
  });

  document.querySelector('.search').querySelectorAll('select').forEach((select) => {
    let arraySort = serverGetStudent();
    select.addEventListener('change', async (e) => {
      arraySort = filterArray(studentsList, 'search-faculty', e.target.value);
      renderTable(arraySort);
    });
  });

  
});
