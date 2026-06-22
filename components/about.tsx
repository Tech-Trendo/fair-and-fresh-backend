import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Users, Clock } from "lucide-react";
import Image from "next/image";

export function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-balance">
              About Fair and Fresh Cleaning
            </h2>
            <p className="text-lg text-gray-600 mb-6 text-pretty">
              Based in Brisbane, Fair and Fresh Cleaning has been providing exceptional fabric cleaning
              services to homes and businesses across Queensland for over 10 years. We specialize in
              professional cleaning of carpets, mattresses, rugs, upholstery, curtains, and car seats.
            </p>
            <p className="text-lg text-gray-600 mb-8 text-pretty">
              Our commitment to fair pricing and fresh results has made us Brisbane&apos;s trusted choice for
              fabric cleaning. We use eco-friendly products and state-of-the-art equipment to ensure the best
              results while protecting your family and the environment.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-semibold">Fully Insured</div>
                  <div className="text-sm text-gray-600">Complete protection</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-semibold">Certified Technicians</div>
                  <div className="text-sm text-gray-600">Professional training</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-semibold">500+ Happy Customers</div>
                  <div className="text-sm text-gray-600">Proven track record</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-semibold">Same Day Service</div>
                  <div className="text-sm text-gray-600">Quick response</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p className="text-gray-600 text-pretty">
                  To provide Brisbane residents with the highest quality fabric cleaning services at fair
                  prices, using eco-friendly methods that protect both your family and the environment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Why Choose Us?</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Advanced cleaning technology and eco-friendly products</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Transparent pricing with no hidden fees</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>100% satisfaction guarantee on all services</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Flexible scheduling including weekends</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Image
              src="/professional-cleaning-team-with-equipment-in-brisb.jpg"
              alt="Fair and Fresh Cleaning team"
              className="rounded-lg shadow-lg w-full"
              width={800}
              height={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
