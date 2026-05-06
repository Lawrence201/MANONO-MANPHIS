export function MapSection() {
  return (
    <section className="w-full h-[450px] relative">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127066.25365111166!2d-0.26330925!3d5.591244349999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed172fb570c03e!2sAccra%2C%20Ghana!5e0!3m2!1sen!2s!4v1714392600000!5m2!1sen!2s" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Manono Manphis Location"
      ></iframe>
      
      {/* Overlay to catch clicks if needed or for styling */}
      <div className="absolute inset-0 pointer-events-none border-t border-b border-gray-100 shadow-inner" />
    </section>
  );
}
