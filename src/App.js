import { useEffect, useState } from "react";
import "./App.scss";

const goods = [
  {
    id: crypto.randomUUID(),
    name: "Пельмені",
    price: 150,
  },
  {
    id: crypto.randomUUID(),
    name: "Хінкалі",
    price: 130,
  },
  {
    id: crypto.randomUUID(),
    name: "Равіолі",
    price: 230,
  },
  {
    id: crypto.randomUUID(),
    name: "Вареники",
    price: 90,
  },
  {
    id: crypto.randomUUID(),
    name: "Галушки",
    price: 112,
  },
];

function App() {
  return (
    <div className="app">
      <ReceiptStuffing goods={goods} />
    </div>
  );
}

function ReceiptStuffing({ goods }) {
  const [inputSearch, setInputSearch] = useState("");
  const [goodsBySearch, setGoodsBySearch] = useState(goods);
  const [selectedGoods, setSelectedGoods] = useState([]);
  const [finalSum, setFinalSum] = useState(0);

  useEffect(() => handleFinalSum());

  function filterSearchResults(input) {
    if (input === "" || !input) {
      setGoodsBySearch(goods);
      return;
    }

    input = input.trim();

    setGoodsBySearch(
      goods.filter(good =>
        good.name.toLowerCase().startsWith(input.toLowerCase())
      )
    );
  }

  function handleShowAll() {
    filterSearchResults("");
  }

  function handleInputSearch(e) {
    setInputSearch(e.target.value);
    filterSearchResults(inputSearch);
  }

  function handleFinalSum() {
    setFinalSum(
      selectedGoods
        ? selectedGoods
            .map(curGood => curGood.sum)
            .reduce((acc, cur) => acc + cur, 0)
        : 0
    );
  }

  function handleSelectedGoods(good) {
    if (selectedGoods.some(curGood => curGood.id === good.id)) {
      handleQuantity("increase", good);
      handleFinalSum();
      return;
    }

    setSelectedGoods(selectedGoods => [
      ...selectedGoods,
      { ...good, quantity: 1 },
    ]);
  }

  function handleRemoveSelected(good) {
    setSelectedGoods(selectedGoods => [
      ...selectedGoods.filter(curGood => curGood.id !== good.id),
    ]);
  }

  function handleClearSelected() {
    setSelectedGoods([]);
  }

  function handleQuantity(action = "increase", good) {
    const updatedGoods = selectedGoods
      .map(curGood => {
        if (curGood.id === good.id) {
          action === "decrease" && curGood.quantity--;
          action === "increase" && curGood.quantity++;
          return curGood.quantity > 0 && curGood;
        }
        return curGood;
      })
      .filter(curGood => curGood);

    setSelectedGoods([...updatedGoods]);
  }

  return (
    <div className="receipt-stuffing">
      <div className="goods-container">
        {goodsBySearch.length !== goods.length && (
          <Button className="btn-show" onClick={handleShowAll}>
            Показати всі
          </Button>
        )}
        <SearchInput
          inputSearch={inputSearch}
          onInputSearch={handleInputSearch}
        />
        <Goods goods={goodsBySearch} onSelectedGood={handleSelectedGoods} />
      </div>
      {selectedGoods.length ? (
        <>
          <Button className="btn-remove" onClick={handleClearSelected}>
            Видалити чек
          </Button>

          <div className="receipt-container">
            <Receipt
              selectedGoods={selectedGoods}
              onRemoveSelected={handleRemoveSelected}
              onHandleQuantity={handleQuantity}
            />
            <Total finalSum={finalSum} />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

function SearchInput({ inputSearch, onInputSearch }) {
  return (
    <input
      value={inputSearch}
      type="text"
      placeholder="Пошук за назвою продукту"
      className="search-input"
      onChange={e => onInputSearch(e)}
    ></input>
  );
}

function Goods({ goods, onSelectedGood }) {
  return (
    <div className="goods">
      <ul className="goods__list">
        {goods.map(good => (
          <GoodItem key={good.id} good={good} onSelectedGood={onSelectedGood} />
        ))}
      </ul>
    </div>
  );
}

function GoodItem({ good, onSelectedGood }) {
  return (
    <li className="goods__item" onClick={() => onSelectedGood(good)}>
      <p>{good.name}</p>
      <p>{good.price} Грн</p>
    </li>
  );
}

function ReceiptHeader() {
  return (
    <div className="receipt__header">
      <p className="col-1">#</p>
      <p className="col-2">Найменування</p>
      <p className="col-3">Кількість</p>
      <p className="col-4">Вартість</p>
    </div>
  );
}

function Receipt({ selectedGoods, onRemoveSelected, onHandleQuantity }) {
  return (
    <div className="receipt">
      <ReceiptHeader />
      <div className="receipt__list-container">
        <ul className="receipt__list">
          {selectedGoods.map((good, i) => (
            <ReceiptItem
              key={good.id}
              good={good}
              index={i}
              onRemoveSelected={onRemoveSelected}
              onHandleQuantity={onHandleQuantity}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function ReceiptItem({ good, index, onRemoveSelected, onHandleQuantity }) {
  good.sum = good.quantity * good.price;
  return (
    <li className="receipt__item">
      <p className="col-1">{index + 1}</p>
      <p className="col-2">{good.name}</p>
      <div className="col-3 quantity-container">
        <button
          className="quantity__btn--decrease item-btn"
          onClick={() => onHandleQuantity("decrease", good)}
        >
          -
        </button>
        <p>{good.quantity}.00</p>
        <button
          className="quantity__btn--increase item-btn"
          onClick={() => onHandleQuantity("increase", good)}
        >
          +
        </button>
      </div>
      <div className="col-4 price-container">
        <div className="price">
          <p className="price__calc">
            {good.quantity}.00 &times; {good.price}
          </p>
          <p className="price__sum">{good.sum}</p>
        </div>
        <button
          className="price__btn--close item-btn"
          onClick={() => onRemoveSelected(good)}
        >
          &times;
        </button>
      </div>
    </li>
  );
}

function Total({ finalSum }) {
  return (
    <div className="total">
      <div className="total__sum">До сплати: {finalSum} грн</div>
      <div className="total__buttons">
        <Button className="pay__btn--card">Картою</Button>
        <Button className="pay__btn--cash">Готівкою</Button>
      </div>
    </div>
  );
}

function Button({ children, className, onClick }) {
  return (
    <button className={`main-btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default App;
