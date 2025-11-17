function LocateButton() {
  const map = useMap();

  const goToCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        map.flyTo(coords, 16);
      },
      (err) => console.log(err)
    );
  };

  return (
    <button
      onClick={goToCurrentLocation}
      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
      title="My current location"
    >
      <LocateFixed size={20} />
    </button>
  );
}
