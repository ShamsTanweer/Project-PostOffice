import "./App.css";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

function App() {
  const [pincode, setPincode] = useState("");
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePincodeChange = (event) => {
    setPincode(event.target.value);
    setDetails(null);
    setError(null);
  };

  const handleLookupClick = async () => {
    if (pincode.length !== 6) {
      setError("Pincode must be 6 digits.");
      setDetails(null);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data.length > 0 && data[0].Status === "Success") {
        const filteredDetails = data[0].PostOffice.filter(
          (office) => office.Pincode === pincode
        );
        if (filteredDetails.length > 0) {
          setDetails(filteredDetails);
          setError(null);
        } else {
          setError("Couldn't find the postal data you're looking for.");
          setDetails(null);
        }
      } else {
        setError(`Couldn't find the postal data you're looking for ${pincode}`);
        setDetails(null);
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <label>
        <strong>Enter Pincode</strong> <br/>
        <input placeholder="Pincode" type="text" value={pincode} onChange={handlePincodeChange} />
      </label> <br/>
      {/* <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/> */}
      <button onClick={handleLookupClick}>Lookup</button>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <div className="loader">
          <ClipLoader color={"black"} loading={true} size={250} />
        </div>
      ) : (
        <>
          {details && (
            <div>
              <h4>Pincode:{pincode}</h4>
              <p>
                <strong>Message:</strong> Number of Pincode(s) found:
                {details.length}
              </p>
            </div>
          )}
          {details && (
            <div className="main">
              {details.map((office) => (
                <div className="container" key={office.Name}>
                  <p>Post office name: {office.Name}</p>
                  <p>Pincode: {office.Pincode}</p>
                  <p>District: {office.District}</p>
                  <p>State: {office.State}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
