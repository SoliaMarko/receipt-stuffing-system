import { useState } from "react";
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
      <ReceiptStuffing />
    </div>
  );
}

function ReceiptStuffing() {
  const [selectedGoods, setSelectedGoods] = useState([]);

  function handleSelectedGoods(good) {
    if (selectedGoods.some(curGood => curGood.id === good.id)) {
      console.log("this good is already selected");
      return;
      // TODO
    }

    setSelectedGoods(selectedGoods => [
      ...selectedGoods,
      { ...good, quantity: 1 },
    ]);
    console.log(selectedGoods);
  }

  function handleRemoveSelected(good) {
    setSelectedGoods(selectedGoods => [
      ...selectedGoods.filter(curGood => curGood.id !== good.id),
    ]);
  }

  function handleDecreaseQuantity(good) {
    const decreasedGood = selectedGoods.find(curGood => curGood.id !== good.id);
    console.log(decreasedGood);

    setSelectedGoods(selectedGoods => [
      ...selectedGoods.filter(curGood => curGood.id !== good.id),
    ]);
  }

  function handleIncreaseQuantity(good) {}

  return (
    <div className="receipt-stuffing">
      <div className="goods-container">
        <SearchInput />
        <Goods goods={goods} onSelectedGood={handleSelectedGoods} />
      </div>
      {selectedGoods.length ? (
        <>
          <Button className="btn-remove">Видалити чек</Button>

          <div className="receipt-container">
            <Receipt
              selectedGoods={selectedGoods}
              onRemoveSelected={handleRemoveSelected}
              onDecreaseQuantity={handleDecreaseQuantity}
            />
            <Total />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
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

function SearchInput() {
  return (
    <input
      type="text"
      placeholder="Пошук за назвою або виробником"
      className="search-input"
    ></input>
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

function Receipt({ selectedGoods, onRemoveSelected, onDecreaseQuantity }) {
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
              onDecreaseQuantity={onDecreaseQuantity}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function ReceiptItem({ good, index, onRemoveSelected, onDecreaseQuantity }) {
  return (
    <li className="receipt__item">
      <p className="col-1">{index + 1}</p>
      <p className="col-2">{good.name}</p>
      <div className="col-3 quantity-container">
        <button
          className="quantity__btn--decrease item-btn"
          onClick={() => onDecreaseQuantity(good)}
        >
          -
        </button>
        <p>{good.quantity}.00</p>
        <button className="quantity__btn--increase item-btn">+</button>
      </div>
      <div className="col-4 price-container">
        <div className="price">
          <p className="price__calc">
            {good.quantity}.00 &times; {good.price}
          </p>
          <p className="price__sum">{good.quantity * good.price}</p>
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

function Total() {
  return (
    <div className="total">
      <div className="total__sum">До сплати: ХХХ грн</div>
      <div className="total__buttons">
        <Button className="pay__btn--card">Картою</Button>
        <Button className="pay__btn--cash">Готівкою</Button>
      </div>
    </div>
  );
}

function Button({ children, className }) {
  return <button className={`main-btn ${className}`}>{children}</button>;
}

export default App;
