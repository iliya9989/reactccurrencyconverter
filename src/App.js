import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyRow from "./CurrencyRow";
import Freecurrencyapi from "@everapi/freecurrencyapi-js";

function App() {
  // currency option state
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [leftCurrency, setLeftCurrency] = useState();
  const [righttCurrency, setRightCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInLeftCurrency, setAmountInLeftCurrency] = useState(true);

  const freecurrencyapi = new Freecurrencyapi(
    "fca_live_YqrONtuLxvqfBKMpc46gBDXNldaqh3RfbeZoLRtM",
  );

  let toAmount, fromAmount;
  if (amountInLeftCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  //On the first render sends request to set available and default options for currencies
  useEffect(() => {
    freecurrencyapi.currencies().then((response) => {
      setCurrencyOptions(Object.keys(response.data));
      setLeftCurrency(Object.keys(response.data)[0]);
      setRightCurrency(Object.keys(response.data)[1]);
    });
  }, []);

  //After manually choosing currency sends request to set the exchange rate
  useEffect(() => {
    if (leftCurrency != null && righttCurrency != null) {
      freecurrencyapi
        .latest({
          base_currency: leftCurrency,
          currencies: righttCurrency,
        })
        .then((response) => {
          setExchangeRate(response.data[Object.keys(response.data)[0]]);
          console.log("The data:");
          console.log(response.data);
          console.log("The entire response:");
          console.log(response);
        });
    }
  }, [leftCurrency, righttCurrency]);
  console.log("The exchange rate: ");
  console.log(exchangeRate);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInLeftCurrency(true);
  }
  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInLeftCurrency(false);
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={leftCurrency}
        onChangeCurrency={(e) => setLeftCurrency(e.target.value)}
        amount={fromAmount}
        onChangeAmount={handleFromAmountChange}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={righttCurrency}
        onChangeCurrency={(e) => setRightCurrency(e.target.value)}
        amount={toAmount}
        onChangeAmount={handleToAmountChange}
      />
    </>
  );
}

export default App;
