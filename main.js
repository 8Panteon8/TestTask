function showTopForm(formName) {
  const forms = document.querySelectorAll(".top-forms form");

  forms.forEach((form) => {
    if (form.classList.contains(formName)) {
      form.classList.toggle("active");
    } else {
      form.classList.remove("active");
    }
  });
}

function showBottomForm(formName) {
  const forms = document.querySelectorAll(".bottom-forms form");

  forms.forEach((form) => {
    if (form.classList.contains(formName)) {
      form.classList.toggle("active");
    } else {
      form.classList.remove("active");
    }
  });
}

const formClient = document.querySelector(".form-client");

formClient.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(formClient);

  try {
    const response = await fetch("http://localhost:8888/test/api/client", {
      method: "POST",
      body: formData,
    });

    console.log("Данные отправлены успешно");
    formClient.reset();
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
  }
});

const formEmployee = document.querySelector(".form-employee");
formEmployee.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(formEmployee);

  try {
    const response = await fetch("http://localhost:8888/test/api/employee", {
      method: "POST",
      body: formData,
    });

    console.log("Данные отправлены успешно");
    formEmployee.reset();
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
  }
});

const formContract = document.querySelector(".form-contract");

formContract.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(formContract);

  try {
    const response = await fetch("http://localhost:8888/test/api/contract", {
      method: "POST",
      body: formData,
    });

    console.log("Данные отправлены успешно");
    formContract.reset();
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
  }
});

const exportClients = document.querySelector(".forme-export");
const info = document.querySelector(".info");
const tbody = info.querySelector("tbody");

exportClients.addEventListener("submit", async function (event) {
  event.preventDefault();

  try {
    const response = await fetch(`http://localhost:8888/test/api/client`, {
      method: "GET",
    });

    const data = await response.json();

    tbody.innerHTML = "";
    contract.innerHTML = "";

    data.forEach((client) => {
      const card = document.createElement("tr");
      card.setAttribute("data-id", client.id);
      card.innerHTML = `
      <td>${client.id}</td>
      <td>${client.NAME}</td>
      <td>${client.INN}</td>
      <td>${client.representative_phone}</td>
      <td><button onclick="deleteClient(${client.id})">Удалить</button></td>
      <td><button onclick="correctClient(${client.id})">Редактировать</button></td>
    `;
      tbody.appendChild(card);
    });
  } catch (error) {
    console.error("Ошибка", error);
  }
});
const contract = document.querySelector(".contract");

const exportClient = document.querySelector(".form_export_id_client");

exportClient.addEventListener("submit", async function (event) {
  event.preventDefault();

  const idClient = document.querySelector("#id_client").value;

  try {
    const response = await fetch(
      `http://localhost:8888/test/api/client/${idClient}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    const firstItem = data.shift();

    const Client = [firstItem];

    tbody.innerHTML = "";
    contract.innerHTML = "";

    Client.forEach((client) => {
      const card = document.createElement("tr");
      card.setAttribute("data-id", client.id);
      card.innerHTML = `
        <td>${client.id}</td>
        <td>${client.NAME}</td>
        <td>${client.INN}</td>
        <td>${client.representative_phone}</td>
        <td><button onclick="deleteClient(${client.id})">Удалить</button></td>
        <td><button onclick="correctClient(${client.id})">Редактировать</button></td>
      `;
      tbody.appendChild(card);
    });

    const table = document.createElement("table");
    table.classList.add(`contractTabel`);
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Начало</th>
          <th>Окончание</th>
          <th>Сумма</th>
          <th>ID владельца</th>
          <th>Удаление</th>
          <th>Редактирование</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `;
    contract.appendChild(table);

    const contacrtCArd = document.querySelector(".contractTabel");

    data.forEach((item) => {
      const card = document.createElement("tr");
      card.classList.add(`contract-${item.id}`);
      card.innerHTML = `
            <td>${item.id}</td>
            <td>${item.start_date}</td>
            <td>${item.end_date}</td>
            <td>${item.amount}</td>
            <td>${item.client_id}</td>
            <td><button onclick="deleteContract(${item.id})">Удалить</button></td>
            <td><button onclick="editСontract(${item.id})">Редактировать</button></td>
      `;

      contacrtCArd.appendChild(card);
    });
  } catch (error) {
    console.error("Ошибка", error);
  }
});

const exportFilterClients = document.querySelector(
  ".form_export_filter_client"
);

exportFilterClients.addEventListener("submit", async function (event) {
  event.preventDefault();

  const from = document.querySelector("#from").value;
  const to = document.querySelector("#to").value;

  try {
    const response = await fetch(
      `http://localhost:8888/test/api/client/${from}/${to}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    tbody.innerHTML = "";
    contract.innerHTML = "";

    data.forEach((client) => {
      const card = document.createElement("tr");
      card.setAttribute("data-id", client.id);
      card.innerHTML = `
      <td>${client.id}</td>
      <td>${client.NAME}</td>
      <td>${client.INN}</td>
      <td>${client.representative_phone}</td>
      <td><button onclick="deleteClient(${client.id})">Удалить</button></td>
      <td><button onclick="correctClient(${client.id})">Редактировать</button></td>
    `;
      tbody.appendChild(card);
    });
  } catch (error) {
    console.error("Ошибка", error);
  }
});

async function deleteClient(id) {
  try {
    const response = await fetch(
      `http://localhost:8888/test/api/client/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();
    if (data) {
      const row = document.querySelector(`tr[data-id="${id}"]`);

      if (row) {
        row.remove();
      }
      console.log("Элемент удален");
    } else {
      console.error("Incomplete or malformed JSON data");
    }
  } catch (error) {
    console.error("Error deleting client:", error);
  }
}

async function deleteContract(id) {
  try {
    const response = await fetch(
      `http://localhost:8888/test/api/contract/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();
    if (data) {
      const row = document.querySelector(`.contract-${id}`);

      if (row) {
        row.remove();
      }
      console.log("Элемент удален");
    } else {
      console.error("Incomplete or malformed JSON data");
    }
  } catch (error) {
    console.error("Error deleting client:", error);
  }
}

async function correctClient(id) {
  try {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const name = row.querySelector("td:nth-child(2)").textContent;
    const inn = row.querySelector("td:nth-child(3)").textContent;
    const phone = row.querySelector("td:nth-child(4)").textContent;

    const correct = document.querySelector(".correct");

    correct.innerHTML = "";

    correct.innerHTML = `
    <form class="form-correct">
      <h2>Форма для редактирования элемента</h2>
      <div class="input">
        <label for="id">ID</label>
        <input type="text" name="id" value="${id}" readonly />
        <label for="name_correct">Имя</label>
        <input type="text" name="name_correct" value="${name}" required />
        <label for="inn_correct">ИНН</label>
        <input type="text" name="inn_correct" value="${inn}" required />
        <label for="phone_correct">Телефон</label>
        <input type="text" name="phone_correct" value="${phone}" required />
      </div>
      <button type="submit">Отправить изменения</button>
    </form>
    `;

    const form = document.querySelector(".form-correct");
    form.classList.add("active");

    document.body.appendChild(correct.firstChild);

    const formCorrect = document.querySelector(".form-correct");

    formCorrect.addEventListener("submit", async (event) => {
      event.preventDefault();

      const id = formCorrect.querySelector('input[name="id"]').value;
      const name = formCorrect.querySelector(
        'input[name="name_correct"]'
      ).value;
      const inn = formCorrect.querySelector('input[name="inn_correct"]').value;
      const phone = formCorrect.querySelector(
        'input[name="phone_correct"]'
      ).value;

      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("inn", inn);
      formData.append("phone", phone);

      try {
        const response = await fetch(
          `http://localhost:8888/test/api/client/${id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        console.log("Данные изменены");
        formCorrect.reset();
      } catch (error) {
        console.error("Ошибка при отправке данных:", error);
      }
    });
  } catch (error) {
    console.error("Error editing client:", error);
  }
}
