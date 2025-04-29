import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useNavigate } from "react-router-dom"; // For navigation
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

// Custom Button component
const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Custom Card components
const Card = ({ className = "", ...props }) => {
  return <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
}

const CardContent = ({ className = "", ...props }) => {
  return <div className={`p-6 pt-0 ${className}`} {...props} />
}

// Icons (simplified versions)
const ArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-2 h-4 w-4"
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
)

const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-green-600"
  >
    <path d="m6 9 6 6 6-6"></path>
  </svg>
)

const Recycle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-10 w-10 text-green-600"
  >
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"></path>
    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"></path>
    <path d="m14 16-3 3 3 3"></path>
    <path d="M8.293 13.596 4.875 9.5l3.418-4.096"></path>
    <path d="m7.14 9.5 5.858 8.518a1.83 1.83 0 0 0 1.56.882c.56 0 1.08-.3 1.356-.788l4.035-6.989a1.785 1.785 0 0 0 .01-1.778A1.83 1.83 0 0 0 18.375 8.5H14"></path>
    <path d="m13 8 3-3-3-3"></path>
  </svg>
)

const ShoppingBag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-10 w-10 text-green-600"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
    <path d="M3 6h18"></path>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
)

const Leaf = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-10 w-10 text-green-600"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>
)

const TrendingUp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-10 w-10 text-green-600"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
    <polyline points="16 7 22 7 22 13"></polyline>
  </svg>
)

const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-white pt-20 md:pt-0">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <FadeInSection>
            <h1 className="text-4xl font-bold leading-tight text-green-900 md:text-5xl lg:text-6xl">
              Transforming Agriwaste into <span className="text-green-600">Sustainable Value</span>
            </h1>
            <p className="mt-6 text-lg text-gray-700">
              Join our marketplace to buy, sell, and recycle agricultural waste products, creating a circular economy
              that benefits farmers, businesses, and our planet.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/organic-waste')}>
                Explore the MarketPlace <ArrowRight />
              </Button>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2} className="relative h-[400px] md:h-[500px]">
            <motion.div
              className="absolute right-0 top-0 h-full w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              {/* Replace Next.js Image with standard img */}
              <img
                src="/images/crop_residues.jpg" // Update with your actual image path
                alt="Agriwaste recycling illustration"
                className="h-full w-full rounded-lg object-cover shadow-xl"
              />
            </motion.div>
          </FadeInSection>
        </div>

        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown />
        </motion.div>
      </div>
    </section>
  )
}

const FeaturesSection = () => {
  const features = [
    {
      icon: <Recycle />,
      title: "Sustainable Recycling",
      description: "Transform agricultural waste into valuable resources through our innovative recycling processes.",
    },
    {
      icon: <ShoppingBag />,
      title: "Marketplace",
      description: "Buy and sell agriwaste products in our secure and transparent digital marketplace.",
    },
    {
      icon: <Leaf />,
      title: "Eco-Friendly Solutions",
      description: "Reduce environmental impact while creating economic opportunities for farmers and businesses.",
    },
    {
      icon: <TrendingUp />,
      title: "Growth Opportunities",
      description: "Expand your business with sustainable practices and access to new markets.",
    },
  ]

  return (
    <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
      <div className="container mx-auto px-4">
        <FadeInSection>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Why Choose Our Platform</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              We provide innovative solutions for agricultural waste management and recycling
            </p>
          </div>
        </FadeInSection>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FadeInSection key={index} delay={index * 0.1}>
              <Card className="h-full border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-green-100">
                <CardContent className="flex h-full flex-col items-center p-6 text-center">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="mb-4 rounded-full bg-green-50 p-4">
                    {feature.icon}
                  </motion.div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

const EnhancedMainSection = () => {
  return (
    <section className="bg-gradient-to-br from-white to-green-50 py-20">
      <div className="container mx-auto px-5 lg:px-36">
        <div className="flex flex-wrap items-center justify-between -mx-4">
          <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
            <FadeInSection>
              <div className="mt-10 lg:mt-0">
                <span className="block mb-2 text-lg font-semibold text-green-600">Join with us</span>
                <h2 className="mb-8 text-3xl font-bold text-zinc-900 sm:text-4xl">
                  Creating a Sustainable Future Through Agriwaste Innovation
                </h2>
                <p className="mb-8 text-base text-gray-600">
                  Our platform connects farmers, recyclers, and businesses to create a circular economy for agricultural
                  waste. By transforming waste into valuable resources, we're building a more sustainable future for
                  agriculture.
                </p>
                <p className="mb-12 text-base text-zinc-900">
                  Join thousands of users already making a difference through our marketplace. Whether you're looking to
                  sell agricultural byproducts or source sustainable materials, our platform makes it simple and
                  efficient.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/organic-waste')}>
                Explore the MarketPlace <ArrowRight />
                </Button>
                </motion.div>
              </div>
            </FadeInSection>
          </div>
          <div className="w-full lg:w-6/12">
            <div className="flex items-center -mx-3 sm:-mx-4">
              <div className="w-full px-3 sm:px-4 xl:w-1/2">
                <FadeInSection delay={0.1}>
                  <div className="py-3 sm:py-4">
                    <motion.div whileHover={{ scale: 1.05 }} className="overflow-hidden rounded-2xl">
                      <img
                        src="/images/Plastic_Waste.jpg" // Update with your actual image path
                        alt="Agricultural waste recycling"
                        className="w-full rounded-2xl transition-transform duration-500 hover:scale-110"
                      />
                    </motion.div>
                  </div>
                </FadeInSection>
                <FadeInSection delay={0.2}>
                  <div className="py-3 sm:py-4">
                    <motion.div whileHover={{ scale: 1.05 }} className="overflow-hidden rounded-2xl">
                      <img
                        src="/images/Plastic_Waste.jpg" // Update with your actual image path
                        alt="Sustainable farming practices"
                        className="w-full rounded-2xl transition-transform duration-500 hover:scale-110"
                      />
                    </motion.div>
                  </div>
                </FadeInSection>
              </div>
              <div className="w-full px-3 sm:px-4 xl:w-1/2">
                <FadeInSection delay={0.3}>
                  <div className="relative z-10 my-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_84,_0.2)]"
                    >
                      <img
                        src="/images/Plastic_Waste.jpg" // Update with your actual image path
                        alt="Agriwaste products"
                        className="w-full rounded-2xl transition-transform duration-500 hover:scale-110"
                      />
                    </motion.div>
                  </div>
                </FadeInSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Register & Connect",
      description: "Create your account and connect with farmers, recyclers, and businesses in your area.",
    },
    {
      number: "02",
      title: "List or Browse Products",
      description: "List your agriwaste products or browse available materials in our marketplace.",
    },
    {
      number: "03",
      title: "Secure Transactions",
      description: "Complete secure transactions with our integrated payment and verification system.",
    },
    {
      number: "04",
      title: "Sustainable Impact",
      description: "Track your environmental impact and contribute to a circular economy.",
    },
  ]

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <FadeInSection>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">How It Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Our simple four-step process makes recycling and trading agriwaste easy and efficient
            </p>
          </div>
        </FadeInSection>

        <div className="relative mt-20">
          

          <div className="grid gap-10 md:grid-cols-4">
            {steps.map((step, index) => (
              <FadeInSection key={index} delay={index * 0.1}>
                <div className="relative flex flex-col items-center">
                  <motion.div
                    className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white"
                    whileHover={{ scale: 1.1 }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-center text-gray-600">{step.description}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const MarketplacePreview = () => {
  const products = [
    {
      title: "Organic Compost",
      category: "Fertilizer",
      price: "$29.99",
      image: "/product1.jpg", // Update with your actual image path
    },
    {
      title: "Rice Husk Biomass",
      category: "Energy",
      price: "$19.99",
      image: "/product2.jpg", // Update with your actual image path
    },
    {
      title: "Coconut Coir",
      category: "Growing Medium",
      price: "$24.99",
      image: "/product3.jpg", // Update with your actual image path
    },
    {
      title: "Sugarcane Bagasse",
      category: "Packaging",
      price: "$15.99",
      image: "/product4.jpg", // Update with your actual image path
    },
  ]

  return (
    <section className="bg-gradient-to-br from-green-50 to-white py-20">
      <div className="container mx-auto px-4">
        <FadeInSection>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Featured Products</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Discover sustainable agriwaste products available on our marketplace
            </p>
          </div>
        </FadeInSection>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <FadeInSection key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -10 }}
                className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                    {product.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">{product.price}</span>
                    <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection delay={0.4}>
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/organic-waste')}>
              View All Products <ArrowRight />
            </Button>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "This platform has transformed how we handle agricultural waste. We've turned what was once a cost center into a revenue stream.",
      author: "Maria Rodriguez",
      role: "Organic Farmer",
      avatar: "/avatar1.jpg", // Update with your actual image path
    },
    {
      quote:
        "As a manufacturer, finding sustainable raw materials was always challenging. This marketplace has made sourcing easy and reliable.",
      author: "James Chen",
      role: "Product Developer",
      avatar: "/avatar2.jpg", // Update with your actual image path
    },
    {
      quote:
        "The transparency and ease of use on this platform has helped us meet our sustainability goals while reducing costs.",
      author: "Sarah Johnson",
      role: "Sustainability Director",
      avatar: "/avatar3.jpg", // Update with your actual image path
    },
  ]

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <FadeInSection>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">What Our Users Say</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Hear from farmers, businesses, and recyclers who are already making a difference
            </p>
          </div>
        </FadeInSection>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeInSection key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex h-full flex-col rounded-xl bg-green-50 p-6 shadow-lg"
              >
                <div className="mb-4 text-green-600">
                  <svg width="45" height="36" className="fill-current">
                    <path d="M13.415.43c-2.523 0-4.75 1.173-6.682 3.52C4.8 6.298 3.756 9.38 3.756 12.89c0 6.498 3.442 11.728 10.325 15.68 1.311.75 2.675 1.173 4.09 1.173 2.214 0 4.068-1.024 5.563-3.072 1.495-2.048 2.242-4.395 2.242-7.04 0-4.2-1.7-7.63-5.102-10.292-1.65-1.3-3.382-1.95-5.196-1.95-.742 0-1.32.15-1.732.448-.413.299-.62.748-.62 1.347 0 .523.15.973.448 1.347.299.374.747.56 1.346.56.224 0 .448-.037.672-.112.523-.15.972-.15 1.346 0 .374.15.673.448.897.897.224.523.336 1.121.336 1.795 0 1.496-.56 2.767-1.682 3.815-1.121 1.048-2.47 1.571-4.04 1.571-1.122 0-2.092-.185-2.915-.56-3.962-1.869-5.944-5.832-5.944-11.888 0-2.842.673-5.16 2.019-6.955 1.346-1.794 3.029-2.691 5.047-2.691 1.795 0 3.327.748 4.597 2.242 1.271 1.496 1.906 3.328 1.906 5.498 0 .523.15.936.448 1.234.374.299.785.448 1.234.448.523 0 .973-.15 1.347-.448.374-.298.56-.71.56-1.234 0-3.29-1.048-6.054-3.143-8.295C19.532 1.61 16.76.43 13.414.43zm21.457 0c-2.523 0-4.75 1.173-6.681 3.52-1.934 2.347-2.9 5.43-2.9 9.24 0 6.498 3.442 11.728 10.325 15.68 1.31.75 2.674 1.173 4.09 1.173 2.214 0 4.067-1.024 5.562-3.072 1.496-2.048 2.243-4.395 2.243-7.04 0-4.2-1.7-7.63-5.102-10.292-1.65-1.3-3.382-1.95-5.196-1.95-.742 0-1.32.15-1.732.448-.412.299-.62.748-.62 1.347 0 .523.15.973.449 1.347.299.374.747.56 1.346.56.224 0 .448-.037.672-.112.523-.15.972-.15 1.346 0 .374.15.674.448.897.897.224.523.336 1.121.336 1.795 0 1.496-.56 2.767-1.681 3.815-1.122 1.048-2.47 1.571-4.04 1.571-1.122 0-2.092-.185-2.916-.56-3.961-1.869-5.943-5.832-5.943-11.888 0-2.842.672-5.16 2.018-6.955 1.346-1.794 3.03-2.691 5.048-2.691 1.795 0 3.327.748 4.597 2.242 1.27 1.496 1.906 3.328 1.906 5.498 0 .523.149.936.448 1.234.374.299.784.448 1.234.448.523 0 .972-.15 1.347-.448.373-.298.56-.71.56-1.234 0-3.29-1.048-6.054-3.144-8.295C40.99 1.61 38.218.43 34.872.43z"></path>
                  </svg>
                </div>
                <p className="mb-6 flex-1 text-gray-700">{testimonial.quote}</p>
                <div className="mt-auto flex items-center">
                  <div className="h-12 w-12 overflow-hidden rounded-full">
                    <img
                      src={testimonial.avatar || "/placeholder.jpg"}
                      alt={testimonial.author}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

const CtaSection = () => {
  return (
    <section className="bg-green-600 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <FadeInSection>
            <h2 className="text-3xl font-bold md:text-4xl">Ready to Join the Agriwaste Revolution?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-green-100">
              Start buying, selling, and recycling agricultural waste today and be part of the sustainable future.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-green-50" onclick={() => navigate('/login')}>
                  Sign Up Now <ArrowRight />
                </Button>
              </motion.div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  )
}



export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
        <Navbar /> 
        <HeroSection />
        <FeaturesSection />
        <EnhancedMainSection />
        <HowItWorksSection />
        <MarketplacePreview />
        <TestimonialsSection />
        <CtaSection />
        <Footer />
    </div>
  )
}
