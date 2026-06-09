function MobileContainer({ children, title }) {
  return (
    <div
      className="bg-light"
      style={{
        minHeight: '100vh'
      }}
    >
      <div
        className="bg-primary text-white text-center py-3 shadow"
      >
        <h4 className="m-0">{title}</h4>
      </div>

      <div
        className="container"
        style={{
          maxWidth: '500px'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default MobileContainer