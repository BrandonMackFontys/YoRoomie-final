function Avatar({ size = 45, src = null }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const avatarImage = src || user?.avatarImage || localStorage.getItem("avatarImage");

    if (avatarImage) {
        return (
            <img
                className="avatar-img"
                src={avatarImage}
                alt="Profielfoto"
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <span className="avatar-fallback" style={{ width: size, height: size }}>
            🧑
        </span>
    );
}

export default Avatar;