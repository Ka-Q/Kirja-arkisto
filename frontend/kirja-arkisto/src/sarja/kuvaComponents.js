import { useState, useEffect } from "react";
import { Button, Image, Stack } from "react-bootstrap";
import theme from "./theme.json";

const KirjaViewerComponent = ({ kirjaIds }) => {

  const [currentImage, setCurrentImage] = useState(null);

  const [rollIndex, setRollIndex] = useState(0);
  const width = 5;
  const BtnStyle = { backgroundColor: theme.button };
  const [booksData, setBooksData] = useState([]);

  useEffect(() => {
    fetchBookData();
  }, []);

  const fetchBookData = async () => {
    try {
      const promises = kirjaIds.map(async (id) => {
        const response = await fetch(`http://localhost:5000/kirja_kaikella?kirja_id=${id}`);
        const data = await response.json();
        return data;
      });
  
      const results = await Promise.all(promises);
      const booksData = results
        .filter((result) => result.status === "OK")
        .map((result) => result.data)
        .flat();
  
      setBooksData(booksData);
  
      // Set the initial currentImage after fetching the books data.
      if (booksData.length > 0 && booksData[0].kuvat.length > 0) {
        setCurrentImage({ ...booksData[0].kuvat[0], book: booksData[0] });
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };
  
  
  

  const handleImageClick = (image, book) => {
    console.log("Image:", image);
    console.log("Book:", book);
    setCurrentImage(prevState => ({ ...prevState, ...image, book }));
  };
  

  

  if (!currentImage) {
    return <div>Loading...</div>;
  }
  const sortedKirjat = sortByJärjestysnumero(booksData[0].kuvat);
  const previewList = mapKirjaToPreviews(booksData, "http://localhost:5000/kuvatiedosto?kuva=", currentImage, handleImageClick);
  const totalImages = (booksData) => {
    return booksData.reduce((acc, book) => acc + book.kuvat.length, 0);
  };
  const getImageByIndex = (index) => {
    let currentIndex = 0;
    for (const book of booksData) {
      for (const image of book.kuvat) {
        if (currentIndex === index) {
          return { image, book };
        }
        currentIndex++;
      }
    }
    return null;
  };
  
  const handleIncrease = () => {
    const totalImagesCount = totalImages(booksData);
    if (rollIndex < totalImagesCount - width) {
      setRollIndex(rollIndex + 1);
      const { image, book } = getImageByIndex(rollIndex + 1);
      if (image && book) {
        setCurrentImage({ ...image, book });
      }
    }
  };
  
  const handleDecrease = () => {
    if (rollIndex > 0) {
      setRollIndex(rollIndex - 1);
      const { image, book } = getImageByIndex(rollIndex - 1);
      if (image && book) {
        setCurrentImage({ ...image, book });
      }
    }
  };
  

  const remainingImages = totalImages(booksData) - (rollIndex + width);

  return (
    <div>
      <div className="mx-auto" style={{ width: "100%", height: "auto", marginBottom: "1em" }}>
      <a href={`http://localhost:5000/kuvatiedosto?kuva=${currentImage.kuva}`} target="_blank" rel="noopener noreferrer" style={{ cursor: "pointer" }}>
          <Image src={`http://localhost:5000/kuvatiedosto?kuva=${currentImage.kuva}`} fluid style={{ width: "100%" }} />
        </a>
      </div>
      <Stack direction="horizontal" gap={1}>
        <Button onClick={(e) => handleDecrease()} className="btn btn-dark" style={BtnStyle}>
          {"< " }
        </Button>
        {previewList}
        <Button onClick={(e) => handleIncrease()} className="btn btn-dark" style={BtnStyle}>
          {"> " }
        </Button>
      </Stack>
      
      <div style={{ textAlign: "left" }}>
  {currentImage.book && (
    <>
      <p>Nimi: {currentImage.book.nimi}</p>
      <p>Järjestysnumero: {currentImage.book.jarjestysnumero}</p>
      <p>Kuvaus: {currentImage.book.kuvaus}</p>
      <p>Kirjailijat: {currentImage.book.kirjailijat}</p>
      <p>Ensipainosvuosi: {currentImage.book.ensipainosvuosi}</p>
    </>
  )}
</div>
      </div>
    
  );
};

const sortByJärjestysnumero = (kirjat) => {
  return kirjat.sort((a, b) => {
    if (a.jarjestysnumero < b.jarjestysnumero) return -1;
    if (a.jarjestysnumero > b.jarjestysnumero) return 1;
    return 0;
  });
};

// Update mapKirjaToPreviews function to display only the first image of each book
const mapKirjaToPreviews = (booksData, kirjaSrc, currentImage, handleImageClick) => {
  let previewList = [];

  booksData.forEach((book) => {
    if (book.kuvat.length > 0) {
      const n = book.kuvat[0];
      let style = { width: "30%" };
      let clickedStyle = { width: "30%", border: "2px solid black", borderRadius: "5px" };

      if (currentImage.kuva_id === n.kuva_id) {
        previewList.push(
          <div key={`${book.kirja_id}-0`} onClick={(e) => handleImageClick(n, book)} style={clickedStyle}>
            <Image src={kirjaSrc + n.kuva} thumbnail fluid />
          </div>
        );
      } else {
        previewList.push(
          <div key={`${book.kirja_id}-0`} onClick={(e) => handleImageClick(n, book)} style={style}>
            <Image src={kirjaSrc + n.kuva} thumbnail fluid />
          </div>
        );
      }
    }
  });

  return previewList;
};

export { KirjaViewerComponent };
